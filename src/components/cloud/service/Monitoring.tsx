import { Show } from "solid-js";
import { clientOnly } from "@solidjs/start";
import { graphic } from "echarts";
import { EChartSSR } from "./EChartSSR";
import { A, useParams } from "@solidjs/router";

export const formatterFactory =
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

const minimalChart = ({
  data,
  color = computeColor,
  smooth = true,
  step = "",
  type = "log",
  start,
  end,
}) => ({
  xAxis: {
    type: "time",
    boundaryGap: false,
    show: false,
    min: start.getTime(),
    max: end.getTime(),
  },
  yAxis: {
    type,
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
      data: data?.map(([k, v]) => [k * 1000, v]),
      type: "line",
      step,
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

export const Monitoring = ({
  data: {
    stats: { compute, memory, requests, pods },
    start,
    end,
  },
}) => {
  // const cpuUsage = createAsync(() => getCpuUsage(props));
  // const memoryUsage = createAsync(() => getMemoryUsage());
  // const requests = createAsync(() => getRequests());
  // const podsCount = createAsync(() => getPodsCount());

  const ClientOnlyEChart = clientOnly(() => import("./EChart"));

  const params = useParams();

  return (
    <>
      <div class="flex flex-wrap flex-row gap-2 my-2">
        <A
          href={`/cloud/apps/${params.app}/stats/compute`}
          class="card grow bg-base-200 w-48 h-32 max-w-lg overflow-hidden"
        >
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
                    start,
                    end,
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
        </A>
        <A
          href={`/cloud/apps/${params.app}/stats/memory`}
          class="card grow bg-base-200 w-48 h-32 max-w-lg overflow-hidden"
        >
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
                    start,
                    end,
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
        </A>
        <A
          href={`/cloud/apps/${params.app}/stats/requests`}
          class="card grow bg-base-200 w-48 h-32 max-w-lg overflow-hidden"
        >
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
                    type: "value",
                    start,
                    end,
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
        </A>
        <A
          href={`/cloud/apps/${params.app}/stats/pods`}
          class="card grow bg-base-200 w-48 h-32 max-w-lg overflow-hidden"
        >
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
                    step: "start",
                    type: "value",
                    start,
                    end,
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
        </A>
      </div>
    </>
  );
};
