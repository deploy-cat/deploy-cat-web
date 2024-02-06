import { createSignal, For, Show } from "solid-js";
import { createServerData$ } from "solid-start/server";
import { refetchRouteData, useRouteData } from "solid-start";
import { getSession } from "@solid-auth/base";
import { authOptions } from "../../server/auth";
import { knative } from "~/k8s";
import { Service } from "~/components/cloud/service/Service";
import { CreateServiceForm } from "~/components/cloud/CreateServiceForm";
import { openModal } from "~/components/ModalWrapper";

export const routeData = () =>
  createServerData$(async (_, { request }) => {
    const session = await getSession(request, authOptions);
    if (session?.user?.name) {
      return knative.getServices(session.user.name);
    }
  });

export const Page = () => {
  const data = useRouteData();
  const [showCreateService, setShowCreateService] = createSignal(false);

  return (
    <div class="w-full">
      <section class="grid 2xl:grid-cols-3 gap-2 w-full p-2">
        <For each={data()?.services}>
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

export default Page;
