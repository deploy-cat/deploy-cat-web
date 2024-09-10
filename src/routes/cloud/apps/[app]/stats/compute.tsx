import { createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { getCompute } from "~/lib/prometheus";
import { Show } from "solid-js";
import { fullChart, computeFormatter } from "~/lib/echartsHelpers";

export const route = {
  load: ({ params }) => {
    getCompute(params.app);
  },
} satisfies RouteDefinition;

export default () => {
  const ClientOnlyEChart = clientOnly(
    () => import("~/components/cloud/service/EChart")
  );
  const params = useParams();

  const stats = createAsync(() => getCompute(params.app));

  return (
    <>
      <div class="card bg-base-200 w-full h-96 grow shadow-xl">
        <div class="card-body p-4">
          <h2 class="card-title text-xl font-medium">
            Compute Usage per Minute
          </h2>
          <Show when={stats()}>
            {(data) => (
              <ClientOnlyEChart
                option={fullChart({
                  data: data().data?.data?.result[1]?.values,
                  start: data().start,
                  end: data().end,
                  formatter: computeFormatter,
                })}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                opts={{
                  renderer: "svg",
                }}
              />
            )}
          </Show>
        </div>
      </div>
    </>
  );
};
