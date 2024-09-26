import { clientOnly } from "@solidjs/start";
import { knative } from "~/lib/k8s";
import { getUser } from "~/lib/auth";
import { rangeQuery } from "~/lib/prometheus";
import { cache, createAsync } from "@solidjs/router";
import { graphic } from "echarts";
import { Show } from "solid-js";
import { formatterFactory } from "./Monitoring";

const getData = cache(async (app: string) => {
  "use server";

  const user = await getUser();
  const service = await knative.getService(app, user.name);

  const namespace = user.name;
  const revision = service.raw.status.latestReadyRevisionName;

  const end = new Date();
  end.setSeconds(0);
  end.setMilliseconds(0);

  const start = new Date(end.getTime() - 60 * 120 * 1000);
  const step = 60;

  const compute = await rangeQuery({
    query: `sum(rate(container_cpu_usage_seconds_total{namespace="${namespace}", pod=~"${revision}.*", container != "POD", container != ""}[1m])) by (container)`,
    start,
    end,
    step,
  });

  return {
    stats: compute,
    start,
    end,
  };
}, "traffic-details");

export default ({ app }) => {
  const ClientOnlyEChart = clientOnly(() => import("./EChart"));

  const stats = createAsync(() => getData(app));

  return (
    <>
      <Show when={stats()}>
        {(data) => (
          <ClientOnlyEChart
            option={{
              xAxis: {
                type: "time",
                boundaryGap: false,
                // data: data()?.stats.data.result[1]?.values.map(([k, v]) =>
                //   new Date(k * 1000).toLocaleTimeString()
                // ),
                min: data().start.getTime(),
                max: data().end.getTime(),
              },
              yAxis: {
                type: "log",
                axisLabel: {
                  formatter: formatterFactory({ prefix: "s" }),
                },
              },
              dataZoom: [
                {
                  type: "inside",
                  start: data().start.getTime(),
                  end: data().end.getTime(),
                },
                {
                  start: data().start.getTime(),
                  end: data().end.getTime(),
                },
              ],
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
                  data: data().stats?.data?.result[1]?.values.map(([k, v]) => [
                    k * 1000,
                    v,
                  ]),
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
        )}
      </Show>
    </>
  );
};
