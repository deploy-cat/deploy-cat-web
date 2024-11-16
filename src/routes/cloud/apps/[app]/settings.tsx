import { EnvVarsInput } from "~/components/EnvVarsInput";
import { ScalingInput } from "~/components/ScalingInput";
import { ResourcesInput } from "~/components/ResourcesInput";
import { SourceInput } from "~/components/cloud/service/SourceInput";
import { Service } from "~/components/cloud/service/Service";
import { CreateServiceForm } from "~/components/cloud/CreateServiceForm";
import { action, useSubmission } from "@solidjs/router";
import { toNumber } from "~/lib/knative";
import { knative } from "~/lib/k8s";
import { getUser } from "~/lib/auth";
import { RouteDefinition } from "@solidjs/router";
import { createAsync } from "@solidjs/router";
import { useParams } from "@solidjs/router";
import { cache } from "@solidjs/router";
import { Show } from "solid-js";

const getService = cache(async (app: string) => {
  "use server";
  const user = await getUser();
  return await knative.getService(app, user.name);
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
  await knative.updateService(form.get("name") as string, service, user.name);
};

const updateServiceAction = action(updateServiceFromForm, "updateService");

export const route = {
  load: ({ params }) => {
    getService(params.app);
  },
} satisfies RouteDefinition;

export default () => {
  const params = useParams();
  const updateServiceStatus = useSubmission(updateServiceAction);
  const service = createAsync(() => getService(params.app));

  return (
    <>
      <Show when={service()}>
        {(service) => (
          <form action={updateServiceAction} method="post">
            <div class="grid lg:grid-cols-2 gap-2 my-2">
              <div class="collapse collapse-arrow bg-base-200">
                <input type="checkbox" checked />
                {/* <input type="radio" name="my-accordion-2" checked={true} /> */}
                <div class="collapse-title text-xl font-medium">General</div>
                <div class="collapse-content">
                  <label class="form-control w-full">
                    {/* <div class="label">
                      <span class="label-text">Name</span>
                    </div> */}
                    <input
                      type="hidden"
                      name="name"
                      required
                      value={service().name}
                      class="input input-bordered w-full"
                    />
                  </label>
                  <SourceInput service={service()} />
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
              <div class="collapse collapse-arrow bg-base-200">
                <input type="checkbox" checked />
                {/* <input type="radio" name="my-accordion-2" /> */}
                <div class="collapse-title text-xl font-medium">
                  Environment
                </div>
                <div class="collapse-content">
                  <EnvVarsInput data={service()?.envVars} />
                </div>
              </div>
              <div class="collapse collapse-arrow bg-base-200">
                {/* <input type="radio" name="my-accordion-2" /> */}
                <input type="checkbox" checked />
                <div class="collapse-title text-xl font-medium">Resources</div>
                <div class="collapse-content">
                  <ResourcesInput data={service()?.resources} />
                </div>
              </div>
              <div class="collapse collapse-arrow bg-base-200">
                {/* <input type="radio" name="my-accordion-2" /> */}
                <input type="checkbox" checked />
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
              New Revision
            </button>
          </form>
        )}
      </Show>
    </>
  );
};
