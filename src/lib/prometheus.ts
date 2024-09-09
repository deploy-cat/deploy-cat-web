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
