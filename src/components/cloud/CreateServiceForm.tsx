import { Show } from "solid-js";
import { action, useSubmission } from "@solidjs/router";
import { knative } from "~/k8s";
import { EnvVarsInput } from "../EnvVarsInput";
import { ScalingInput } from "../ScalingInput";
import { ResourcesInput } from "../ResourcesInput";
import { getUser } from "~/lib/server";

const createServiceFromForm = async (form: FormData) => {
  "use server";
  const service = {
    name: form.get("name") as string,
    image: form.get("image") as string,
    port: Number(form.get("port")) as number,
    cpuLimit: `${form.get("cpuLimit")}m` as string,
    memoryLimit: `${form.get("memoryLimit")}Mi` as string,
    minScale: Number(form.get("minScale")) as number,
    maxRequests: Number(form.get("maxRequests")) as number,
  };
  const user = await getUser();
  await knative.createService(service, user.username);
};

const createServiceAction = action(createServiceFromForm, "createService");

export const CreateServiceForm = () => {
  const createServiceStatus = useSubmission(createServiceAction);

  return (
    <dialog id="create-service-modal" class="modal">
      <div class="modal-box">
        <form action={createServiceAction} method="post">
          <h3 class="font-bold text-lg">Deploy new App</h3>
          <div class="collapse collapse-arrow bg-base-200 my-2">
            <input type="radio" name="my-accordion-2" checked={true} />
            <div class="collapse-title text-xl font-medium">Name and Image</div>
            <div class="collapse-content">
              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text">Name</span>
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="my-app"
                  class="input input-bordered w-full"
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
                  placeholder="traefik/whoami"
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
                  placeholder="80"
                  class="input input-bordered w-full"
                />
              </label>
            </div>
          </div>
          <div class="collapse collapse-arrow bg-base-200 my-2">
            <input type="radio" name="my-accordion-2" />
            <div class="collapse-title text-xl font-medium">Environment</div>
            <div class="collapse-content">
              <EnvVarsInput />
            </div>
          </div>
          <div class="collapse collapse-arrow bg-base-200 my-2">
            <input type="radio" name="my-accordion-2" />
            <div class="collapse-title text-xl font-medium">Resources</div>
            <div class="collapse-content">
              <ResourcesInput />
            </div>
          </div>
          <div class="collapse collapse-arrow bg-base-200 my-2">
            <input type="radio" name="my-accordion-2" />
            <div class="collapse-title text-xl font-medium">Scaling</div>
            <div class="collapse-content">
              <ScalingInput />
            </div>
          </div>
          <button type="submit" id="submitForm" class="hidden" />
        </form>
        <div class="modal-action">
          <form method="dialog">
            <button id="closeDialog" class="btn">
              Close
            </button>
          </form>
          <label for="submitForm" tabindex={0} class="btn btn-primary">
            <Show when={createServiceStatus.pending}>
              <span class="loading loading-spinner"></span>
            </Show>
            Deploy
          </label>
        </div>
      </div>
    </dialog>
  );
};
