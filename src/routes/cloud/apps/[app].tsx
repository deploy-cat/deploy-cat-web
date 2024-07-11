import { createSignal, For, Show } from "solid-js";
import { knative } from "~/k8s";
import { Service } from "~/components/cloud/service/Service";
import { CreateServiceForm } from "~/components/cloud/CreateServiceForm";
import {
  cache,
  createAsync,
  A,
  useParams,
  type RouteDefinition,
  type RouteSectionProps,
} from "@solidjs/router";
import { getUser } from "~/lib/server";
import { Status } from "~/components/cloud/service/Status";
import { EnvVarsInput } from "~/components/EnvVarsInput";
import { ScalingInput } from "~/components/ScalingInput";
import { ResourcesInput } from "~/components/ResourcesInput";
import { action, useSubmission } from "@solidjs/router";
import { toNumber } from "~/knative";

const getService = cache(async (app: string) => {
  "use server";
  const user = await getUser();
  return await knative.getService(app, user.username);
}, "service");

const updateServiceFromForm = async (form: FormData) => {
  "use server";
  const service = {
    name: form.get("name") as string,
    image: form.get("image") as string,
    port: Number(form.get("port")) as number,
    resources: {
      cpuLimit: toNumber(form.get("cpuLimit")),
      memoryLimit: toNumber(form.get("memoryLimit")),
    },
    scaling: {
      minScale: toNumber(form.get("minScale")),
      maxRequests: toNumber(form.get("maxRequests")),
    },
    envVars: JSON.parse(form.get("env") as string) as { [key: string]: string },
  };
  const user = await getUser();
  await knative.updateService(
    form.get("name") as string,
    service,
    user.username
  );
};

const updateServiceAction = action(updateServiceFromForm, "updateService");

export const route = {
  load: ({ params }) => {
    getService(params.app);
  },
} satisfies RouteDefinition;

export default (props: RouteSectionProps) => {
  const params = useParams();
  const service = createAsync(() => getService(params.app));
  const updateServiceStatus = useSubmission(updateServiceAction);

  return (
    <div class="w-full">
      <Show when={service()} fallback={<span>no service with this name</span>}>
        <section class="m-2">
          <h1 class="text-2xl font-medium my-5">{service()?.name}</h1>

          <div role="tablist" class="tabs tabs-lifted">
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              class="tab"
              aria-label="Info"
              checked
            />
            <div
              role="tabpanel"
              class="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              <p class="font-normal text-gray-700 dark:text-gray-400 my-1">
                <a
                  class="text-sky-400"
                  href={service()?.raw.status.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {service()?.raw.status.url}
                </a>
              </p>
              <p class="font-bold text-sm text-gray-700 dark:text-gray-400 my-1">
                <Show
                  when={service()?.raw.status.conditions?.length}
                  fallback={<span>n/a/</span>}
                >
                  <Status conditions={service()?.raw.status.conditions} />
                </Show>
              </p>
            </div>
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              class="tab"
              aria-label="Monitoring"
            />
            <div
              role="tabpanel"
              class="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              Trafic graph / Requests graph
            </div>
          </div>

          <form action={updateServiceAction} method="post">
            <div class="flex flex-wrap flex-row gap-2 my-2">
              <div class="collapse collapse-arrow bg-base-200 w-96 max-w-lg grow">
                <input type="checkbox" />
                {/* <input type="radio" name="my-accordion-2" checked={true} /> */}
                <div class="collapse-title text-xl font-medium">General</div>
                <div class="collapse-content">
                  <label class="form-control w-full">
                    <div class="label">
                      <span class="label-text">Name</span>
                    </div>
                    <input
                      type="text"
                      name="name"
                      required
                      value={service()?.name}
                      class="input input-bordered w-full"
                      disabled
                    />
                  </label>
                  <label class="form-control w-full">
                    <div class="label">
                      <span class="label-text">Image</span>
                    </div>
                    <input
                      type="text"
                      name="image"
                      required
                      value={service()?.image}
                      class="input input-bordered w-full"
                    />
                  </label>
                  <label class="form-control w-full">
                    <div class="label">
                      <span class="label-text">Port</span>
                    </div>
                    <input
                      type="number"
                      name="port"
                      required
                      value={service()?.port}
                      class="input input-bordered w-full"
                    />
                  </label>
                </div>
              </div>
              <div class="collapse collapse-arrow bg-base-200 w-96 max-w-lg grow">
                <input type="checkbox" />
                {/* <input type="radio" name="my-accordion-2" /> */}
                <div class="collapse-title text-xl font-medium">
                  Environment
                </div>
                <div class="collapse-content">
                  <EnvVarsInput data={service()?.envVars} />
                </div>
              </div>
              <div class="collapse collapse-arrow bg-base-200 w-96 max-w-lg grow">
                {/* <input type="radio" name="my-accordion-2" /> */}
                <input type="checkbox" />
                <div class="collapse-title text-xl font-medium">Resources</div>
                <div class="collapse-content">
                  <ResourcesInput data={service()?.resources} />
                </div>
              </div>
              <div class="collapse collapse-arrow bg-base-200 w-96 max-w-lg grow">
                {/* <input type="radio" name="my-accordion-2" /> */}
                <input type="checkbox" />
                <div class="collapse-title text-xl font-medium">Scaling</div>
                <div class="collapse-content">
                  <ScalingInput data={service()?.scaling} />
                </div>
              </div>
            </div>
            <button class="btn btn-primary">
              <Show when={updateServiceStatus.pending}>
                <span class="loading loading-spinner"></span>
              </Show>
              Submit Changes
            </button>
          </form>
        </section>
      </Show>
    </div>
  );
};
