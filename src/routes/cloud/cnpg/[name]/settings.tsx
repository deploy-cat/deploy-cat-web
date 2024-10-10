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
import { cnpg } from "~/lib/k8s";
import { schemaDatabse } from "~/lib/types";
import { spec } from "node:test/reporters";

const getDB = cache(async (name: string) => {
  "use server";
  const user = await getUser();
  return await cnpg.getDatabase(name, user.name);
}, "database");

const updateDatabseFromForm = async (form: FormData) => {
  "use server";
  try {
    const database = await schemaDatabse.parseAsync({
      name: form.get("name"),
      instances: Number(form.get("instances")),
      size: Number(form.get("size")),
    });
    const user = await getUser();
    await cnpg.updateDatabase(database.name, database, user.name);
  } catch (e) {
    console.error(e);
  }
};

const updateDatabaseAction = action(updateDatabseFromForm, "updateService");

export const route = {
  load: ({ params }) => {
    getDB(params.name);
  },
} satisfies RouteDefinition;

export default () => {
  const params = useParams();
  const updateDatabaseStatus = useSubmission(updateDatabaseAction);
  const db = createAsync(() => getDB(params.name));

  return (
    <>
      <Show when={db()}>
        {(db) => (
          <form action={updateDatabaseAction} method="post">
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
                    value={db()?.metadata.name}
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
                    value={db().spec.instances}
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
                    value={db().spec.storage.size.replace("Gi", "")}
                    placeholder="1"
                    class="input input-bordered w-full"
                  />
                </label>
              </div>
            </div>
            <button type="submit" class="btn btn-primary">
              <Show when={updateDatabaseStatus.pending}>
                <span class="loading loading-spinner"></span>
              </Show>
              Update
            </button>
          </form>
        )}
      </Show>
    </>
  );
};
