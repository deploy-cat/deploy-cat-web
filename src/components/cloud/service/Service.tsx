import { For, Show } from "solid-js";
import { Status } from "./Status";
import { knative } from "~/k8s";
import { TrashIcon } from "@deploy-cat/heroicons-solid/24/solid/esm";
import { getUser } from "~/lib/server";
import { action, useSubmission, A } from "@solidjs/router";

const deleteServiceFromForm = async (form: FormData) => {
  "use server";
  const service = {
    name: form.get("name") as string,
  };
  const user = await getUser();
  await knative.deleteService(service.name, user.username);
};

const deleteServiceAction = action(deleteServiceFromForm, "createService");

export const Service = ({ service }) => {
  const deleteServiceStatus = useSubmission(deleteServiceAction);

  return (
    <figure class="card relative basis-64 bg-base-200 shadow grow">
      <div class="card-body">
        <A class="card-title" href={`/cloud/apps/${service.metadata.name}`}>{service.metadata.name}</A>

        <p class="font-normal text-gray-700 dark:text-gray-400 my-1">
          <For each={service.spec.template.spec.containers}>
            {(container) => <span>{container.image}</span>}
          </For>
        </p>
        <p class="font-normal text-gray-700 dark:text-gray-400 my-1">
          <a
            class="text-sky-400"
            href={service.status.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {service.status.url}
          </a>
        </p>
        <p class="font-bold text-sm text-gray-700 dark:text-gray-400 my-1">
          <Show
            when={service.status.conditions?.length}
            fallback={<span>n/a/</span>}
          >
            <Status conditions={service.status.conditions} />
          </Show>
        </p>
      </div>
      <div class="absolute top-4 right-4">
        <form action={deleteServiceAction} method="post">
          <input type="hidden" name="name" value={service.metadata.name} />
          <button type="submit" disabled={deleteServiceStatus.pending}>
            <TrashIcon class="flex-shrink-0 w-5 h-5 text-gray-500 hover:text-red-500 transition duration-75 dark:text-gray-400 dark:hover:text-red-800" />
          </button>
        </form>
      </div>
    </figure>
  );
};
