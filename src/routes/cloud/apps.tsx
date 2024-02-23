import { createSignal, For, Show } from "solid-js";
import { knative } from "~/k8s";
import { Service } from "~/components/cloud/service/Service";
import { CreateServiceForm } from "~/components/cloud/CreateServiceForm";
import { cache, createAsync, type RouteDefinition } from "@solidjs/router";
import { getUser } from "~/lib/server";

const getServices = cache(async () => {
  "use server";
  const user = await getUser();
  return await knative.getServices(user.username);
}, "services");

export const route = {
  load: () => {
    getUser();
    getServices();
  },
} satisfies RouteDefinition;

export default () => {
  const services = createAsync(() => getServices());

  return (
    <div class="w-full">
      <section class="grid 2xl:grid-cols-3 gap-2 w-full p-2">
        <For each={services()?.services}>
          {(service) => <Service service={service} />}
        </For>
      </section>
      <section class="p-2">
        <button
          class="btn btn-primary"
          onClick={() =>
            (
              document.getElementById(
                "create-service-modal"
              ) as HTMLDialogElement
            ).showModal()
          }
        >
          Deploy App
        </button>
      </section>
      <CreateServiceForm />
    </div>
  );
};
