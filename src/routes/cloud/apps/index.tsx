import { For } from "solid-js";
import { knative } from "~/k8s";
import { Service } from "~/components/cloud/service/Service";
import { CreateServiceForm } from "~/components/cloud/CreateServiceForm";
import { cache, createAsync, A, type RouteDefinition } from "@solidjs/router";
import { getUser } from "~/lib/server";
import { StatusBadge } from "~/components/cloud/service/StatusBadge";

const getServices = cache(async () => {
  "use server";
  const user = await getUser();
  return await knative.getServices(user.username);
}, "services");

export const route = {
  load: () => {
    getServices();
  },
} satisfies RouteDefinition;

export default () => {
  const services = createAsync(() => getServices());

  return (
    <>
      <section class="my-7">
        <div class="flex justify-between items-center">
          <h1 class="text-4xl font-medium">Apps</h1>
          <button
            class="btn btn-primary btn-outline"
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
        </div>
      </section>
      <section class="my-7">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Last Revision</th>
                <th class="hidden md:block">URL</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <For each={services()?.services}>
                {(service) => (
                  <tr>
                    <td class="flex gap-2">
                      {service.name}{" "}
                      <StatusBadge
                        conditions={service.raw.status.conditions}
                        disableDropdown={true}
                      />
                    </td>
                    <td>
                      {new Date(
                        service.raw.status.conditions.find(
                          (condition) => condition.type === "RoutesReady"
                        ).lastTransitionTime
                      ).toLocaleString()}
                    </td>
                    <td class="hidden md:block">
                      <a class="link" href={service.raw.status.url}>
                        {service.raw.status.url}
                      </a>
                    </td>
                    <td>
                      <A
                        href={`/cloud/apps/${service.name}`}
                        class="btn btn-xs btn-outline"
                      >
                        Details
                      </A>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </section>
      {/* <section class="grid 2xl:grid-cols-3 gap-2 w-full">
        <For each={services()?.services}>
          {(service) => <Service service={service} />}
        </For>
      </section> */}
      <CreateServiceForm />
    </>
  );
};
