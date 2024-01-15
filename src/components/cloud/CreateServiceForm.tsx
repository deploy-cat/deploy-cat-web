import { createServerAction$, redirect } from "solid-start/server";
import { Show } from "solid-js";
import { k8sCustomObjects } from "~/k8s";
import { knative } from "~/k8s";

export const CreateServiceForm = () => {
  const [enrolling, { Form }] = createServerAction$(
    async (form: FormData, { request }) => {
      const service = {
        name: form.get("name") as string,
        image: form.get("image") as string,
        port: Number(form.get("port")) as number,
      };

      await knative.createService(service);
    }
  );

  return (
    <dialog id="create-service-modal" class="modal">
      <Form class="modal-box">
        <h3 class="font-bold text-lg">Deploy new App</h3>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Name</span>
          </div>
          <input
            type="text"
            name="name"
            required
            placeholder="my-app"
            class="input input-bordered w-full max-w-xs"
          />
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Image</span>
          </div>
          <input
            type="text"
            name="image"
            required
            placeholder="traefik/whoami"
            class="input input-bordered w-full max-w-xs"
          />
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Port</span>
          </div>
          <input
            type="number"
            name="port"
            required
            placeholder="80"
            class="input input-bordered w-full max-w-xs"
          />
        </label>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn">Close</button>
          </form>
          <button type="submit" class="btn btn-primary">
            <Show when={enrolling.pending}>
              <span class="loading loading-spinner"></span>
            </Show>
            Deploy
          </button>
        </div>
      </Form>
    </dialog>
  );
};
