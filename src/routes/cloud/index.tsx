import { knative } from "~/lib/k8s";
import { getUser } from "~/lib/auth";
import { A, cache, createAsync, type RouteDefinition } from "@solidjs/router";
import { getSession } from "@solid-mediakit/auth";
import { getWebRequest } from "vinxi/http";
import { authOptions } from "~/lib/auth";

const getServices = cache(async () => {
  "use server";
  const user = await getUser()
  return await knative.getServices(user.name);
}, "services2");

export const route = {
  load: () => {
    getServices();
  },
} satisfies RouteDefinition;

export default () => {
  const services = createAsync(() => getServices());

  return (
    <section class="grid 2xl:grid-cols-3 gap-2 w-full p-2">
      <figure class="card relative basis-64 bg-base-200 shadow grow">
        <div class="card-body">
          <div class="card-title">Apps</div>
          <p>{services()?.services.length} Apps runnging</p>
          <A href="/cloud/apps" class="btn btn-primary">
            View Apps
          </A>
        </div>
      </figure>
    </section>
  );
};
