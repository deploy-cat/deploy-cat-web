import * as echarts from "echarts";
import { clientOnly } from "@solidjs/start";
import { Show } from "solid-js";
import EChart from "./EChart";
import { isServer } from "solid-js/web";

export function EChartSSR({ option, onlyServer }) {
  const chart = echarts.init(null, null, {
    renderer: "svg", // must use SVG rendering mode
    ssr: true, // enable SSR
    width: 192, // need to specify height and width
    height: 128,
  });
  chart.setOption(option);
  const svg = chart.renderToSVGString();
  chart.dispose();

  const ClientOnlyEChart = clientOnly(() => import("./EChart"));

  return isServer || onlyServer ? (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
      class="flex items-end"
      innerHTML={svg}
    ></div>
  ) : (
    <ClientOnlyEChart option={option} />
  );
}
