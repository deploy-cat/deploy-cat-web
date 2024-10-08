import * as echarts from "echarts";
import { clientOnly } from "@solidjs/start";
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

  const innerSVG = svg.match(/(<svg.*?\>)(?<inner>.*?)(<\/svg\>)/s)?.groups
    ?.inner;

  const ClientOnlyEChart = clientOnly(() => import("./EChart"));

  return isServer || onlyServer ? (
    <svg
      style={{
        width: "100%",
        height: "100%",
      }}
      class="flex items-end"
      preserveAspectRatio="none"
      viewBox="0 0 192 128"
      innerHTML={innerSVG}
    ></svg>
  ) : (
    <ClientOnlyEChart option={option} />
  );
}
