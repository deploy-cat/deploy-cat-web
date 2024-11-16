import { Show } from "solid-js";
import { action, redirect, useSubmission } from "@solidjs/router";
import { getUser } from "~/lib/auth";
import { cnpg } from "~/lib/k8s";
import { schemaDatabse } from "~/lib/types";

const createDatabaseFromForm = async (form: FormData) => {
  "use server";
  try {
    const database = await schemaDatabse.parseAsync({
      name: form.get("name"),
      init: {
        database: form.get("database"),
        owner: form.get("owner"),
      },
      instances: Number(form.get("instances")),
      size: Number(form.get("size")),
    });
    const user = await getUser();
    await cnpg.createDatabase(database, user.name);
  } catch (e) {
    console.error(e);
  }
};

const createDatabaseAction = action(createDatabaseFromForm, "createDatabase");

export const CreateDatabaseForm = () => {
  const createDatabaseStatus = useSubmission(createDatabaseAction);

  return (
    <dialog id="create-database-modal" class="modal">
      <div class="modal-box">
        <form action={createDatabaseAction} method="post">
          <h3 class="font-bold text-lg">Deploy new Database</h3>
          <div class="collapse collapse-arrow bg-base-200 my-2">
            <input type="radio" name="my-accordion-2" checked={true} />
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
                  placeholder="my-database"
                  class="input input-bordered w-full"
                />
              </label>
              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text">Instances</span>
                </div>
                <input
                  type="number"
                  name="instances"
                  required
                  placeholder="3"
                  class="input input-bordered w-full"
                />
              </label>
              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text">Size in GiB</span>
                </div>
                <input
                  type="number"
                  name="size"
                  required
                  placeholder="1"
                  class="input input-bordered w-full"
                />
              </label>
            </div>
          </div>
          <div class="collapse collapse-arrow bg-base-200 my-2">
            <input type="radio" name="my-accordion-2" />
            <div class="collapse-title text-xl font-medium">Bootstrap</div>
            <div class="collapse-content">
              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text">Database Name</span>
                </div>
                <input
                  type="text"
                  name="database"
                  required
                  placeholder="my-database"
                  class="input input-bordered w-full"
                />
              </label>
              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text">Database Owner</span>
                </div>
                <input
                  type="text"
                  name="owner"
                  required
                  placeholder="my-user"
                  class="input input-bordered w-full"
                />
              </label>
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
            <Show when={createDatabaseStatus.pending}>
              <span class="loading loading-spinner"></span>
            </Show>
            Deploy
          </label>
        </div>
      </div>
    </dialog>
  );
};
