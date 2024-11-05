import { knative } from "~/lib/k8s";
import {
  cache,
  createAsync,
  useParams,
  type RouteDefinition,
} from "@solidjs/router";
import { getUser } from "~/lib/auth";
import humanizeDuration from "humanize-duration";
import { For } from "solid-js";
import { StatusBadge } from "~/components/cloud/service/StatusBadge";

const getService = cache(async (app: string) => {
  "use server";
  const user = await getUser();
  return await knative.getService(app, user.name);
}, "service");

const getRevisions = cache(async (app: string) => {
  "use server";
  const user = await getUser();
  return await knative.getRevisions(app, user.name);
}, "revisions");

export const route = {
  load: ({ params }) => {
    getService(params.app);
    getRevisions(params.app);
  },
} satisfies RouteDefinition;

export default () => {
  const params = useParams();
  const service = createAsync(() => getService(params.app));
  const revisions = createAsync(() => getRevisions(params.app));

  return (
    <>
      <div class="card bg-base-200 my-2">
        <div class="card-body">
          <h2 class="card-title">Revisions</h2>
          <div
            class="tooltip w-fit"
            data-tip={new Date(
              service()?.raw.status.conditions.find(
                (condition) => condition.type === "RoutesReady"
              ).lastTransitionTime
            ).toLocaleString()}
          >
            <p>
              Last Revision{" "}
              {humanizeDuration(
                new Date(
                  service()?.raw.status.conditions.find(
                    (condition) => condition.type === "RoutesReady"
                  ).lastTransitionTime
                ).getTime() - Date.now(),
                { round: true, largest: 2 }
              )}{" "}
              ago
            </p>
          </div>
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Revision</th>
                  <th>Date</th>
                  <th class="hidden md:table-cell">Traffic</th>
                  <th class="hidden sm:table-cell">Source</th>
                </tr>
              </thead>
              <tbody>
                <For each={revisions()?.reverse()}>
                  {(revision) => (
                    <tr>
                      <td class="flex gap-2 items-center">
                        {revision.metadata.name}{" "}
                        <StatusBadge
                          conditions={revision.status.conditions}
                          disableDropdown={true}
                        />
                      </td>
                      <td>
                        <div
                          class="tooltip"
                          data-tip={new Date(
                            revision.status.conditions.find(
                              (condition) => condition.type === "Ready"
                            )?.lastTransitionTime
                          ).toLocaleString()}
                        >
                          {humanizeDuration(
                            new Date(
                              revision.status.conditions.find(
                                (condition) => condition.type === "Ready"
                              )?.lastTransitionTime
                            ).getTime() - Date.now(),
                            { round: true, largest: 1 }
                          )}{" "}
                          ago
                        </div>
                      </td>
                      <td class="hidden md:table-cell">
                        {service()?.raw.status?.traffic?.find(
                          (e) => e.revisionName === revision.metadata.name
                        )?.percent ?? 0}
                        %
                      </td>
                      <td class="hidden sm:table-cell">
                        {revision.metadata.annotations[
                          "apps.deploycat.io/source"
                        ] ?? "unknown"}
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
