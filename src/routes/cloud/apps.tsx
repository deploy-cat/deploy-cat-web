import { createSignal, For, Show } from "solid-js";
import { createServerData$ } from "solid-start/server";
import { refetchRouteData, useRouteData } from "solid-start";
import { getSession } from "@solid-auth/base";
import { authOptions } from "../../server/auth";
import { k8sCustomObjects } from "../../k8s";
import { Service } from "~/components/cloud/service/Service";
import { CreateServiceForm } from "~/components/cloud/CreateServiceForm";
import { setModalStore } from "~/root";

export const routeData = () =>
  createServerData$(
    async (_, event) => {
      const session = await getSession(event.request, authOptions);
      if (session?.user?.name) {
        const { body } = await k8sCustomObjects.listNamespacedCustomObject(
          "serving.knative.dev",
          "v1",
          session.user.name,
          "services",
        );
        return {
          services: body?.items,
        };
      }
    },
  );

export const Page = () => {
  const data = useRouteData();
  const [showCreateService, setShowCreateService] = createSignal(false);

  return (
    <div class="w-full">
      {
        /* <section>
        <button onClick={refetchRouteData}><ArrowPathIcon class="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" /></button>
      </section> */
      }
      <section class="grid md:grid-cols-3 w-full m-0">
        <For each={data()?.services}>
          {(service) => <Service service={service} />}
        </For>
        <button
          onClick={() => setShowCreateService(!showCreateService())}
          // onClick={() => setModalStore({modal: <CreateServiceForm />})}
          class="card basis-64 grow block p-6 m-3 text-center border-none outline-dashed outline-stone-400 dark:bg-slate-400/10 hover:drop-shadow-md transition-all duration-100"
        >
          <span class="text-3xl text-slate-400">+</span>
        </button>
      </section>
      <Show when={showCreateService()}>
        <CreateServiceForm />
      </Show>
    </div>
  );
};

export default Page;
