import { For } from "solid-js";
import { createServerAction$ } from "solid-start/server";
import { Status } from "./Status";
import { k8sCustomObjects } from "~/k8s";
import { TrashIcon } from "@deploy-cat/heroicons-solid/24/solid/esm";

export const Service = ({ service }) => {
  const [deleting, { Form }] = createServerAction$(
    async (form: FormData, { request }) => {
      const service = {
        name: form.get("name") as string,
      };

      const { body } = await k8sCustomObjects.deleteNamespacedCustomObject(
        "serving.knative.dev",
        "v1",
        "adb-sh",
        "services",
        service.name,
      );
    },
  );

  return (
    <figure class="card relative basis-64 grow p-6 m-3 hover:drop-shadow-md transition-all duration-100">
      <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {service.metadata.name}
      </h2>
      <div class="absolute top-4 right-4">
        <Form>
          <input type="hidden" name="name" value={service.metadata.name} />
          <button type="submit" disabled={deleting.pending}>
            <TrashIcon class="flex-shrink-0 w-5 h-5 text-gray-500 hover:text-red-500 transition duration-75 dark:text-gray-400 dark:hover:text-red-800" />
          </button>
        </Form>
      </div>
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
    </figure>
  );
};
