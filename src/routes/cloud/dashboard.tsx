import { A } from "@solidjs/router";
import server$, { createServerData$ } from "solid-start/server";
import { useRouteData } from "solid-start";
import { getSession } from "@solid-auth/base";
import { authOptions } from "../../server/auth";
import { knative } from "~/k8s";

export const routeData = () =>
  createServerData$(async (_, { request }) => {
    const session = await getSession(request, authOptions);
    if (session?.user?.name) {
      return knative.getServices(session.user.name);
    }
  });

export const Page = () => {
  const data = useRouteData();

  return (
    <section class="grid 2xl:grid-cols-3 gap-2 w-full p-2">
      <figure class="card relative basis-64 bg-base-200 shadow grow">
        <div class="card-body">
          <div class="card-title">Apps</div>
          <p>{data()?.services.length} Apps runnging</p>
          <A href="/cloud/apps" class="btn btn-primary">
            View Apps
          </A>
        </div>
      </figure>
    </section>
  );
};

export default Page;
