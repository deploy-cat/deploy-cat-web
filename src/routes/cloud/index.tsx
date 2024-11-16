import { cnpg, knative } from "~/lib/k8s";
import { getUser } from "~/lib/auth";
import { A, cache, createAsync, type RouteDefinition } from "@solidjs/router";

const getOverview = cache(async () => {
  "use server";
  const user = await getUser();
  const apps = await knative.getServices(user.name);
  const dbs = await cnpg.getDatabases(user.name);
  return { apps, dbs };
}, "overview");

export const route = {
  load: () => {
    getOverview();
  },
} satisfies RouteDefinition;

export default () => {
  const overview = createAsync(() => getOverview());

  return (
    <section class="grid 2xl:grid-cols-3 gap-2 w-full p-2">
      <figure class="card relative basis-64 bg-base-200 shadow grow">
        <div class="card-body">
          <div class="card-title">Apps</div>
          <p>{overview()?.apps.services.length} Apps runnging</p>
          <A href="/cloud/apps" class="btn btn-primary">
            View Apps
          </A>
        </div>
      </figure>
      <figure class="card relative basis-64 bg-base-200 shadow grow">
        <div class="card-body">
          <div class="card-title">Postgres</div>
          <p>{overview()?.dbs.length} Databases runnging</p>
          <A href="/cloud/cnpg" class="btn btn-primary">
            View Postgres
          </A>
        </div>
      </figure>
    </section>
  );
};
