import { knative } from "~/lib/k8s";
import {
  cache,
  createAsync,
  useParams,
  type RouteDefinition,
} from "@solidjs/router";
import { getUser } from "~/lib/auth";
import { For } from "solid-js";
import { k8sCore } from "~/lib/k8s";

const getDatabaseSecret = cache(async (db: string) => {
  "use server";
  const user = await getUser();
  const secrets = await k8sCore.listNamespacedSecret(
    user.name,
    undefined,
    undefined,
    undefined,
    undefined,
    `cnpg.io/cluster=${db}`
  );
  return secrets.body.items.map(({ data, metadata: { name, labels } }) => ({
    name,
    labels,
    data,
  }))[0];
}, "db-secret");

export const route = {
  load: ({ params }) => {
    getDatabaseSecret(params.name);
  },
} satisfies RouteDefinition;

export default () => {
  const params = useParams();
  const secret = createAsync(() => getDatabaseSecret(params.name));

  return (
    <>
      <div class="card bg-base-200 my-2">
        <div class="card-body">
          <h2 class="card-title">Secrets</h2>
          <div class="overflow-x-auto">
            <table class="table table-xs">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <For each={Object.entries(secret()?.data ?? {})}>
                  {([key, value]) => (
                    <tr>
                      <td>{key}</td>
                      <td>
                        <label class="swap">
                          <input type="checkbox" />
                          <div class="swap-on">
                            <code>{atob(value)}</code>
                          </div>
                          <div class="swap-off">
                            <code class="break-words">
                              {[...atob(value)].fill("*").slice(0, 40)}
                            </code>
                          </div>
                        </label>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
