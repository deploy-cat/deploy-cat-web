import { For } from "solid-js";
import { createServerData$ } from "solid-start/server";
import { useRouteData } from "solid-start";
import { getSession } from "@solid-auth/base";
import { authOptions } from "../../server/auth";
import { k8sCustomObjects } from "../../k8s";

export const routeData = () =>
  createServerData$(
    async (_, event) => {
      const session = await getSession(event.request, authOptions);
      const { body } = await k8sCustomObjects.listNamespacedCustomObject(
        "serving.knative.dev",
        "v1",
        session.user.name,
        "services",
      );
      return {
        session,
        services: body?.items,
      };
    },
  );

export const Page = () => {
  const data = useRouteData();

  return (
    <section class="grid md:grid-cols-3 w-full m-0">
      <For each={data()?.services}>
        {(service) => (
          <figure class="card basis-64 grow p-6 m-3 dark:hover:shadow-2xl transition-all duration-100 cursor-pointer">
            <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {service.metadata.name}
            </h2>
            <p class="font-normal text-gray-700 dark:text-gray-400 my-1">
              <For each={service.spec.template.spec.containers}>
                {(container) => <span>{container.image}</span>}
              </For>
            </p>
            <p class="font-normal text-gray-700 dark:text-gray-400 my-1">
              <a
                class="text-sky-400"
                href={service.status.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {service.status.url}
              </a>
            </p>
          </figure>
        )}
      </For>
      <button class="card basis-64 grow block p-6 m-3 text-center border-none outline-dashed outline-stone-400 dark:bg-slate-400/10 dark:hover:shadow-2xl transition-all duration-100">
        <span class="text-3xl text-slate-400">+</span>
      </button>
    </section>
  );
};

export default Page;
