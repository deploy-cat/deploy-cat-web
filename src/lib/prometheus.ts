import { cache } from "@solidjs/router";
import { getUser } from "./server";
import { knative } from "~/k8s";

const baseUrl = `${process.env.DEPLOYCAT_PROMETHEUS_URL}/api/v1`;

export const rangeQuery = async ({
  query,
  start,
  end,
  step,
}: {
  query: string;
  start: Date;
  end: Date;
  step: number;
}) => {
  const url = new URL(`${baseUrl}/query_range`);
  url.search = new URLSearchParams({
    query,
    start: start.toISOString(),
    end: end.toISOString(),
    step: step.toString(),
  }).toString();
  return await fetch(url).then((data) => data.json());
};

const queryLastCoupleMinutes = async ({ query, minutes = 20 }) => {
  const end = new Date();
  end.setSeconds(0);
  end.setMilliseconds(0);

  const start = new Date(end.getTime() - 60 * minutes * 1000);
  const step = 60;
  const result = await rangeQuery({ query, start, end, step });

  return {
    data: result,
    start,
    end,
  };
};

export const getCompute = cache(async (app: string) => {
  "use server";

  const user = await getUser();
  const service = await knative.getService(app, user.username);

  const namespace = user.username;
  const revision = service.raw.status.latestReadyRevisionName;

  return await queryLastCoupleMinutes({
    query: `sum(rate(container_cpu_usage_seconds_total{namespace="${namespace}", pod=~"${revision}.*", container != "POD", container != ""}[1m])) by (container)`,
    minutes: 120,
  });
}, "compute-stats");

export const getMemory = cache(async (app: string) => {
  "use server";

  const user = await getUser();
  const service = await knative.getService(app, user.username);

  const namespace = user.username;
  const revision = service.raw.status.latestReadyRevisionName;

  return await queryLastCoupleMinutes({
    query: `sum(container_memory_usage_bytes{namespace="${namespace}", pod=~"${revision}.*", container != "POD", container != ""}) by (container)`,
    minutes: 120,
  });
}, "memory-stats");

export const getRequests = cache(async (app: string) => {
  "use server";

  const user = await getUser();
  const service = await knative.getService(app, user.username);

  const namespace = user.username;
  const revision = service.raw.status.latestReadyRevisionName;

  return await queryLastCoupleMinutes({
    query: `label_replace(round(sum(rate(activator_request_count{namespace_name="${namespace}", configuration_name=~"${app}",revision_name=~"${revision}"}[1m])) by (revision_name), 0.001), "revision_name", "$2", "revision_name", "${app}(-+)(.*)")`,
    minutes: 120,
  });
}, "requests-stats");

export const getPods = cache(async (app: string) => {
  "use server";

  const user = await getUser();
  const service = await knative.getService(app, user.username);

  const namespace = user.username;
  const revision = service.raw.status.latestReadyRevisionName;

  return await queryLastCoupleMinutes({
    query: `sum(autoscaler_actual_pods{namespace_name="${namespace}", configuration_name="${app}", revision_name="${revision}"})`,
    minutes: 120,
  });
}, "pods-stats");
