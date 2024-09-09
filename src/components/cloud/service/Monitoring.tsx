import { createSignal, For, Show } from "solid-js";
import { cache, createAsync, A, type RouteDefinition } from "@solidjs/router";
import { rangeQuery } from "~/lib/prometheus";
import { clientOnly } from "@solidjs/start";
import { onMount } from "solid-js";
import { Chart, Title, Tooltip, Legend, Colors } from "chart.js";
import { Line } from "solid-chartjs";
// import TrafficChart from "./TrafficChart";
// import { EChartsAutoSize } from "echarts-solid";
import SolidECharts from "solid-echarts";
import EChart from "./EChart";
import { graphic } from "echarts";
import { EChartSSR } from "./EChartSSR";

// const start = new Date(Date.now() - 60 * 20 * 1000);
// const end = new Date();
// const step = 60;

// const getCpuUsage = cache(async ({ namespace, app, revision }) => {
//   "use server";

//   return await rangeQuery({
//     query: `sum(rate(container_cpu_usage_seconds_total{namespace="adb-sh", pod=~"nginx-00001.*", container != "POD", container != ""}[1m])) by (container)`,
//     start,
//     end,
//     step,
//   });
// }, "cpu-usage");

// const getMemoryUsage = cache(async () => {
//   "use server";

//   return await rangeQuery({
//     query: `sum(container_memory_usage_bytes{namespace="adb-sh", pod=~"nginx-00001.*", container != "POD", container != ""}) by (container)`,
//     start,
//     end,
//     step,
//   });
// }, "memory-usage");

// const getRequests = cache(async () => {
//   "use server";

//   return await rangeQuery({
//     query: `label_replace(round(sum(rate(activator_request_count{namespace_name="adb-sh", configuration_name=~"nginx",revision_name=~"nginx-00001"}[1m])) by (revision_name), 0.001), "revision_name", "$2", "revision_name", "nginx(-+)(.*)")`,
//     start,
//     end,
//     step,
//   });
// }, "requests");

// const getPodsCount = cache(async () => {
//   "use server";

//   return await rangeQuery({
//     query: `sum(autoscaler_actual_pods{namespace_name="adb-sh", configuration_name="nginx", revision_name="nginx-00001"})`,
//     start,
//     end,
//     step: 60,
//   });
// }, "pods-count");

// export const route = {
//   load: (conf) => {
//     console.log("lol");
//     getCpuUsage(conf);
//     getMemoryUsage();
//     getRequests();
//     getPodsCount();
//   },
// } satisfies RouteDefinition;

const formatterFactory =
  ({ digits = 0, prefix = "" }) =>
  (n) => {
    const ranges = [
      { divider: 1e9, suffix: "G" },
      { divider: 1e6, suffix: "M" },
      { divider: 1e3, suffix: "k" },
      { divider: 1, suffix: "" },
      { divider: 1e-3, suffix: "m" },
      { divider: 1e-6, suffix: "μ" },
      { divider: 1e-9, suffix: "n" },
    ];
    for (let i = 0; i < ranges.length; i++) {
      if (n >= ranges[i].divider) {
        return `${(n / ranges[i].divider).toFixed(digits)} ${
          ranges[i].suffix
        }${prefix}`;
      }
    }
    return `${n} ${prefix}`;
  };

const getAverage = (arr: Array<number>) =>
  arr.reduce((acc, v) => acc + v) / arr.length;

const getLast = (arr: Array<number>) => arr[arr.length - 1];

const computeColor = new graphic.LinearGradient(0, 0, 0, 1, [
  {
    offset: 0,
    color: "rgb(128, 255, 165)",
  },
  {
    offset: 1,
    color: "rgb(1, 191, 236)",
  },
]);
const memoryColor = new graphic.LinearGradient(0, 0, 0, 1, [
  {
    offset: 0,
    color: "rgb(55, 162, 255)",
  },
  {
    offset: 1,
    color: "rgb(116, 21, 219)",
  },
]);

const requestsColor = new graphic.LinearGradient(0, 0, 0, 1, [
  {
    offset: 0,
    color: "rgb(255, 0, 135)",
  },
  {
    offset: 1,
    color: "rgb(135, 0, 157)",
  },
]);

const podsCountColor = new graphic.LinearGradient(0, 0, 0, 1, [
  {
    offset: 0,
    color: "rgb(255, 191, 0)",
  },
  {
    offset: 1,
    color: "rgb(224, 62, 76)",
  },
]);

const minimalChart = ({ data, color = computeColor, smooth = true }) => ({
  xAxis: {
    type: "category",
    boundaryGap: false,
    show: false,
    data: data.map(([k, v]) => new Date(k * 1000).toLocaleTimeString()),
    // min: start.toLocaleTimeString(),
    // max: end.toLocaleTimeString(),
  },
  yAxis: {
    show: false,
  },
  animation: false,
  grid: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  series: [
    {
      data: data.map(([k, v]) => v),
      type: "line",
      smooth,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.2,
        color,
      },
    },
  ],
});

export const Monitoring = ({ data: { compute, memory, requests, pods } }) => {
  // const cpuUsage = createAsync(() => getCpuUsage(props));
  // const memoryUsage = createAsync(() => getMemoryUsage());
  // const requests = createAsync(() => getRequests());
  // const podsCount = createAsync(() => getPodsCount());

  const ClientOnlyEChart = clientOnly(() => import("./EChart"));

  return (
    <>
      <div class="flex flex-wrap flex-row gap-2 my-2">
        <button class="card grow bg-base-200 w-48 h-32 max-w-lg overflow-hidden shadow-xl">
          <Show
            when={compute?.data.result[1]?.values}
            fallback={
              <div class="absolute flex flex-col h-full w-full items-center justify-center">
                <h2 class="text-xl font-medium">Compute Usage</h2>
                <p>no data</p>
              </div>
            }
          >
            {(data) => (
              <>
                <EChartSSR
                  option={minimalChart({
                    data: data(),
                  })}
                  onlyServer={true}
                />
                <div class="absolute flex flex-col h-full w-full items-center justify-center">
                  <h2 class="text-xl font-medium">Compute Usage</h2>
                  <p>
                    ~{" "}
                    {formatterFactory({ prefix: "s", digits: 2 })(
                      getAverage(data().map(([k, v]) => Number(v)))
                    )}{" "}
                    / min
                  </p>
                </div>
              </>
            )}
          </Show>
        </button>
        <button class="card grow bg-base-200 w-48 h-32 max-w-lg overflow-hidden shadow-xl">
          <Show
            when={memory?.data.result[1]?.values}
            fallback={
              <div class="absolute flex flex-col h-full w-full items-center justify-center">
                <h2 class="text-xl font-medium">Memory Usage</h2>
                <p>no data</p>
              </div>
            }
          >
            {(data) => (
              <>
                <EChartSSR
                  option={minimalChart({
                    data: data(),
                    color: memoryColor,
                  })}
                  onlyServer={true}
                />
                <div class="absolute flex flex-col h-full w-full items-center justify-center">
                  <h2 class="text-xl font-medium">Memory Usage</h2>
                  <p>
                    ~{" "}
                    {formatterFactory({ prefix: "B", digits: 2 })(
                      getAverage(data().map(([k, v]) => Number(v)))
                    )}{" "}
                  </p>
                </div>
              </>
            )}
          </Show>
        </button>
        <button class="card grow bg-base-200 w-48 h-32 max-w-lg overflow-hidden shadow-xl">
          <Show
            when={requests?.data.result[0]?.values}
            fallback={
              <div class="absolute flex flex-col h-full w-full items-center justify-center">
                <h2 class="text-xl font-medium">Requests</h2>
                <p>no data</p>
              </div>
            }
          >
            {(data) => (
              <>
                <EChartSSR
                  option={minimalChart({
                    data: data(),
                    color: requestsColor,
                  })}
                  onlyServer={true}
                />
                <div class="absolute flex flex-col h-full w-full items-center justify-center">
                  <h2 class="text-xl font-medium">Requests</h2>
                  <p>
                    ~{" "}
                    {formatterFactory({ prefix: "req/s", digits: 2 })(
                      getLast(data().map(([k, v]) => Number(v)))
                    )}{" "}
                  </p>
                </div>
              </>
            )}
          </Show>
        </button>
        <button class="card grow bg-base-200 w-48 h-32 max-w-lg overflow-hidden shadow-xl">
          <Show
            when={pods?.data.result[0]?.values}
            fallback={
              <div class="absolute flex flex-col h-full w-full items-center justify-center">
                <h2 class="text-xl font-medium">Pods</h2>
                <p>no data</p>
              </div>
            }
          >
            {(data) => (
              <>
                <EChartSSR
                  option={minimalChart({
                    data: data(),
                    color: podsCountColor,
                    smooth: false,
                  })}
                  onlyServer={true}
                />
                <div class="absolute flex flex-col h-full w-full items-center justify-center">
                  <h2 class="text-xl font-medium">Pods</h2>
                  <p>
                    {formatterFactory({})(
                      getLast(data().map(([k, v]) => Number(v)))
                    )}
                  </p>
                </div>
              </>
            )}
          </Show>
        </button>
      </div>
      <div class="flex flex-wrap flex-row gap-2 my-2">
        <div class="card bg-base-200 w-96 h-96 max-w-lg grow shadow-xl">
          <div class="card-body p-4">
            <h2 class="card-title text-xl font-medium">
              Compute Usage per Minute
            </h2>
            <Show when={compute}>
              {(data) => (
                <>
                  <ClientOnlyEChart
                    option={{
                      xAxis: {
                        type: "category",
                        boundaryGap: false,
                        data: data()?.data.result[1]?.values.map(([k, v]) =>
                          new Date(k * 1000).toLocaleTimeString()
                        ),
                      },
                      yAxis: {
                        type: "value",
                        axisLabel: {
                          formatter: formatterFactory({ prefix: "s" }),
                        },
                      },
                      animation: false,
                      tooltip: {
                        trigger: "axis",
                        valueFormatter: formatterFactory({
                          prefix: "s",
                          digits: 2,
                        }),
                        axisPointer: {
                          type: "cross",
                          label: {
                            backgroundColor: "#6a7985",
                          },
                        },
                      },
                      series: [
                        {
                          data: data()?.data.result[1]?.values.map(
                            ([k, v]) => v
                          ),
                          type: "line",
                          smooth: true,
                          lineStyle: {
                            width: 0,
                          },
                          showSymbol: false,
                          areaStyle: {
                            opacity: 0.8,
                            color: new graphic.LinearGradient(0, 0, 0, 1, [
                              {
                                offset: 0,
                                color: "rgb(128, 255, 165)",
                              },
                              {
                                offset: 1,
                                color: "rgb(1, 191, 236)",
                              },
                            ]),
                          },
                        },
                      ],
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    opts={{
                      renderer: "svg",
                    }}
                  />
                </>
              )}
            </Show>
          </div>
        </div>
        <div class="card bg-base-200 w-96 h-96 max-w-lg grow shadow-xl">
          <div class="card-body p-4">
            <h2 class="card-title text-xl font-medium">Memory Usage</h2>
            <Show when={memory}>
              {(data) => (
                <>
                  <ClientOnlyEChart
                    option={{
                      xAxis: {
                        type: "category",
                        boundaryGap: false,
                        data: data()?.data.result[1]?.values.map(([k, v]) =>
                          new Date(k * 1000).toLocaleTimeString()
                        ),
                      },
                      yAxis: {
                        type: "value",
                        axisLabel: {
                          formatter: formatterFactory({ prefix: "B" }),
                        },
                      },
                      animation: false,
                      tooltip: {
                        trigger: "axis",
                        valueFormatter: formatterFactory({
                          prefix: "B",
                          digits: 2,
                        }),
                        axisPointer: {
                          type: "cross",
                          label: {
                            backgroundColor: "#6a7985",
                          },
                        },
                      },
                      series: [
                        {
                          data: data()?.data.result[1]?.values.map(
                            ([k, v]) => v
                          ),
                          type: "line",
                          smooth: true,
                          lineStyle: {
                            width: 0,
                          },
                          showSymbol: false,
                          areaStyle: {
                            opacity: 0.8,
                            color: new graphic.LinearGradient(0, 0, 0, 1, [
                              {
                                offset: 0,
                                color: "rgb(55, 162, 255)",
                              },
                              {
                                offset: 1,
                                color: "rgb(116, 21, 219)",
                              },
                            ]),
                          },
                        },
                      ],
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                    opts={{
                      renderer: "svg",
                    }}
                  />
                </>
              )}
            </Show>
          </div>
        </div>
      </div>
    </>
  );
};
