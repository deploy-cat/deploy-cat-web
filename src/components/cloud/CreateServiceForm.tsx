import { createServerAction$, redirect } from "solid-start/server";
import { k8sCustomObjects } from "~/k8s";

export const CreateServiceForm = () => {
  const [enrolling, { Form }] = createServerAction$(
    async (form: FormData, { request }) => {
      const service = {
        name: form.get("name") as string,
        image: form.get("image") as string,
        port: Number(form.get("port")) as number,
      };

      const { body } = await k8sCustomObjects.createNamespacedCustomObject(
        "serving.knative.dev",
        "v1",
        "adb-sh",
        "services",
        {
          "apiVersion": "serving.knative.dev/v1",
          "kind": "Service",
          "metadata": {
            "name": service.name,
            "namespace": "adb-sh",
          },
          "spec": {
            "template": {
              "metadata": {
                "annotations": {
                  //"autoscaling.knative.dev/min-scale": "1",
                },
              },
              "spec": {
                "containerConcurrency": 0,
                "containers": [
                  {
                    "image": service.image,
                    "name": "user-container",
                    "ports": [
                      {
                        "containerPort": service.port,
                        "protocol": "TCP",
                      },
                    ],
                    "readinessProbe": {
                      "successThreshold": 1,
                      "tcpSocket": {
                        "port": 0,
                      },
                    },
                    "resources": {},
                  },
                ],
                "enableServiceLinks": false,
                "timeoutSeconds": 300,
              },
            },
          },
        },
      );
    },
  );

  return (
    <figure class="absolute top-8 left-1/2 -translate-x-1/2 w-128 m-3">
      <div class="overflow-y-auto rounded-xl bg-gray-50 dark:bg-gray-800 drop-shadow-2xl p-6">
        <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Create Service
        </h2>
        <Form>
          <div class="mb-6">
            <label
              for="name"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div class="mb-6">
            <label
              for="image"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Image
            </label>
            <input
              type="text"
              name="image"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div class="mb-6">
            <label
              for="port"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Container Port
            </label>
            <input
              type="number"
              name="port"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary">Deploy</button>
        </Form>

        <div class="inline-flex items-center justify-center w-full">
          <hr class="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
          <span class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-800">
            or
          </span>
        </div>
        <h3 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Add via cli
        </h3>
        <ol class="list-decimal ml-6">
          <li>
            <code class="bg-slate-600 px-1 rounded">
              npx @deploycat/cli service create my-app
            </code>
          </li>
        </ol>
      </div>
    </figure>
  );
};
