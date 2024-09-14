import { k8sCore, knative } from "~/k8s";
import { getUser } from "~/lib/server";
import { RouteDefinition } from "@solidjs/router";
import { createAsync } from "@solidjs/router";
import { useParams } from "@solidjs/router";
import { cache } from "@solidjs/router";
import { For, Show, createSignal } from "solid-js";
// import ColorHash from "color-hash";

// const colorHash = new ColorHash({ saturation: 0.7, lightness: 0.7 });

const getLogs = cache(async (app: string) => {
  "use server";
  const user = await getUser();
  const service = await knative.getService(app, user.username);
  try {
    const pods = (
      await k8sCore.listNamespacedPod(
        user.username,
        undefined,
        undefined,
        undefined,
        undefined,
        `serving.knative.dev/serviceUID=${service.raw.metadata.uid}`
      )
    ).body.items;
    const logs = await Promise.all(
      pods.map(async (pod) => {
        const podLogs = await k8sCore.readNamespacedPodLog(
          pod.metadata.name,
          user.username,
          "user-container",
          false,
          false,
          undefined,
          true,
          false,
          undefined,
          50,
          true
        );
        return {
          pod: {
            name: pod.metadata?.name,
          },
          logs: podLogs.body
            .split("\n")
            .filter((e) => e.length > 0)
            .map((e) => {
              const i = e.indexOf(" ");
              return {
                date: new Date(e.slice(0, i)),
                log: e.slice(i + 1),
                pod: pod.metadata?.name,
              };
            }),
        };
      })
    );
    return logs;
  } catch (e) {
    console.error(e);
  }
}, "service-logs");

export const route = {
  load: ({ params }) => {
    getLogs(params.app);
  },
} satisfies RouteDefinition;

export default () => {
  const params = useParams();
  const logs = createAsync(() => getLogs(params.app));
  const [select, setSelect] = createSignal("all");

  return (
    <>
      <Show
        when={logs()?.length}
        fallback={
          <div role="alert" class="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="h-6 w-6 shrink-0 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>No Logs Available</span>
          </div>
        }
      >
        <label class="form-control w-full max-w-xs my-2">
          <div class="label">
            <span class="label-text">Pod</span>
          </div>
          <select
            value={select()}
            onInput={(e) => setSelect(e.target.value)}
            class="select select-bordered"
          >
            <option value="all">all</option>
            <For each={logs()}>
              {(e, i) => <option value={i()}>{e.pod.name}</option>}
            </For>
          </select>
        </label>
        <div class="overflow-auto max-h-96 my-2">
          <table class="table table-xs table-pin-rows sm:table-pin-cols w-max">
            <tbody>
              <For
                each={
                  select() === "all"
                    ? logs()
                        ?.map((e) => e.logs)
                        .flat()
                        .sort((a, b) => a.date.getTime() - b.date.getTime())
                    : logs()?.[Number(select())].logs
                }
              >
                {(logItem) => (
                  <tr>
                    <th>{logItem.date.toLocaleString()}</th>
                    <Show when={select() === "all"}>
                      <td
                      // style={{
                      //   color: colorHash.hex(logItem.pod ?? ""),
                      // }}
                      >
                        {logItem.pod}
                      </td>
                    </Show>
                    <td>{logItem.log}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
    </>
  );
};
