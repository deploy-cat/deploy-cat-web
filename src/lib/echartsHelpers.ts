import { graphic } from "echarts";

export const formatterFactory =
  ({ digits = 0, prefix = "" } = {}) =>
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

export const defaultFormatter = formatterFactory();
export const computeFormatter = formatterFactory({ prefix: "s" });
export const memoryFormatter = formatterFactory({ prefix: "B" });
export const requestsFormatter = formatterFactory({ prefix: "req/s" });

export const getAverage = (arr: Array<number>) =>
  arr.reduce((acc, v) => acc + v) / arr.length;

export const getLast = (arr: Array<number>) => arr[arr.length - 1];

export const computeColor = new graphic.LinearGradient(0, 0, 0, 1, [
  {
    offset: 0,
    color: "rgb(128, 255, 165)",
  },
  {
    offset: 1,
    color: "rgb(1, 191, 236)",
  },
]);
export const memoryColor = new graphic.LinearGradient(0, 0, 0, 1, [
  {
    offset: 0,
    color: "rgb(55, 162, 255)",
  },
  {
    offset: 1,
    color: "rgb(116, 21, 219)",
  },
]);

export const requestsColor = new graphic.LinearGradient(0, 0, 0, 1, [
  {
    offset: 0,
    color: "rgb(255, 0, 135)",
  },
  {
    offset: 1,
    color: "rgb(135, 0, 157)",
  },
]);

export const podsCountColor = new graphic.LinearGradient(0, 0, 0, 1, [
  {
    offset: 0,
    color: "rgb(255, 191, 0)",
  },
  {
    offset: 1,
    color: "rgb(224, 62, 76)",
  },
]);

export const minimalChart = ({
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

export const fullChart = ({
  data,
  color = computeColor,
  smooth = true,
  step = "",
  type = "log",
  formatter = defaultFormatter,
  tooltipFormatter = formatter,
  start,
  end,
}) => ({
  xAxis: {
    type: "time",
    boundaryGap: true,
    min: start,
    max: end,
  },
  yAxis: {
    type,
    logBase: "10",
    axisLabel: {
      formatter: formatter,
    },
  },
  dataZoom: [
    {
      type: "inside",
      start: start.getTime(),
      end: end.getTime(),
    },
    {
      start: start.getTime(),
      end: end.getTime(),
    },
  ],
  animation: false,
  tooltip: {
    trigger: "axis",
    valueFormatter: tooltipFormatter,
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985",
      },
    },
  },
  series: [
    {
      data: data?.map(([k, v]) => [k * 1000, v]),
      type: "line",
      step,
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color,
      },
    },
  ],
});
