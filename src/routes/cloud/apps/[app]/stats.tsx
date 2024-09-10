import { Show } from "solid-js";
import { knative } from "~/k8s";
import {
  cache,
  createAsync,
  A,
  useParams,
  type RouteDefinition,
  type RouteSectionProps,
} from "@solidjs/router";
import { getUser } from "~/lib/server";
import { Monitoring } from "~/components/cloud/service/Monitoring";
import { rangeQuery } from "~/lib/prometheus";

const getService = cache(async (app: string) => {
  "use server";
  const user = await getUser();
  return await knative.getService(app, user.username);
}, "service");

const getMonitoringOverview = cache(async (app: string) => {
  "use server";

  const user = await getUser();
  const service = await knative.getService(app, user.username);

  const namespace = user.username;
  const revision = service.raw.status.latestReadyRevisionName;

  const end = new Date();
  end.setSeconds(0);
  end.setMilliseconds(0);

  const start = new Date(end.getTime() - 60 * 20 * 1000);
  const step = 60;

  const compute = await rangeQuery({
    query: `sum(rate(container_cpu_usage_seconds_total{namespace="${namespace}", pod=~"${revision}.*", container != "POD", container != ""}[1m])) by (container)`,
    start,
    end,
    step,
  });

  const memory = await rangeQuery({
    query: `sum(container_memory_usage_bytes{namespace="${namespace}", pod=~"${revision}.*", container != "POD", container != ""}) by (container)`,
    start,
    end,
    step,
  });

  const requests = await rangeQuery({
    query: `label_replace(round(sum(rate(activator_request_count{namespace_name="${namespace}", configuration_name=~"${app}",revision_name=~"${revision}"}[1m])) by (revision_name), 0.001), "revision_name", "$2", "revision_name", "${app}(-+)(.*)")`,
    start,
    end,
    step,
  });

  const pods = await rangeQuery({
    query: `sum(autoscaler_actual_pods{namespace_name="${namespace}", configuration_name="${app}", revision_name="${revision}"})`,
    start,
    end,
    step,
  });

  return {
    stats: {
      compute,
      memory,
      requests,
      pods,
    },
    start,
    end,
  };
}, "monitoring-overview");

export const route = {
  load: ({ params }) => {
    getService(params.app);
    getMonitoringOverview(params.app);
  },
} satisfies RouteDefinition;

export default (props: RouteSectionProps) => {
  const params = useParams();
  const monitoring = createAsync(() => getMonitoringOverview(params.app));

  return (
    <div class="w-full">
      <Show when={monitoring()}>{(data) => <Monitoring data={data()} />}</Show>
      {props.children}
    </div>
  );
};
