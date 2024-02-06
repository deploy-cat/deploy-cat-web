import { createServerAction$, redirect } from "solid-start/server";
import { Show, createSignal, For } from "solid-js";
import { k8sCustomObjects } from "~/k8s";
import { knative } from "~/k8s";
import { getSession } from "@solid-auth/base";
import { authOptions } from "~/server/auth";
import { EnvVarsInput } from "../EnvVarsInput";
import { ScalingInput } from "../ScalingInput";
import { ResourcesInput } from "../ResourcesInput";

export const CreateServiceForm = () => {
  const [enrolling, { Form }] = createServerAction$(
    async (form: FormData, { request }) => {
      // const service = Object.fromEntries(form.entries());
      const service = {
        name: form.get("name") as string,
        image: form.get("image") as string,
        port: Number(form.get("port")) as number,
        cpuLimit: `${form.get("cpuLimit")}m` as string,
        memoryLimit: `${form.get("memoryLimit")}Mi` as string,
        minScale: Number(form.get("minScale")) as number,
        maxRequests: Number(form.get("maxRequests")) as number,
      };
      const session = await getSession(request, authOptions);
      if (session?.user?.name) {
        await knative.createService(service, session.user.name);
      }
    }
  );

  return (
    <dialog id="create-service-modal" class="modal">
      <div class="modal-box">
        <Form>
          <h3 class="font-bold text-lg">Deploy new App</h3>
          <div class="collapse collapse-arrow bg-base-200 my-2">
            <input type="radio" name="my-accordion-2" checked="checked" />
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
        </Form>
        <div class="modal-action">
          <form method="dialog">
            <button id="closeDialog" class="btn">
              Close
            </button>
          </form>
          <label for="submitForm" tabindex={0} class="btn btn-primary">
            <Show when={enrolling.pending}>
              <span class="loading loading-spinner"></span>
            </Show>
            Deploy
          </label>
        </div>
      </div>
    </dialog>
  );
};
