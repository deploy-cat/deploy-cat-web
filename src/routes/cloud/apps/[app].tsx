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

const getService = cache(async (app: string) => {
  "use server";
  const user = await getUser();
  return await knative.getService(app, user.username);
}, "service");

export const route = {
  load: ({ params }) => {
    getService(params.app);
  },
} satisfies RouteDefinition;

export default (props: RouteSectionProps) => {
  const params = useParams();
  const service = createAsync(() => getService(params.app));

  return (
    <div class="w-full">
      <Show when={service()} fallback={<span>no service with this name</span>}>
        <section>
          <div>{service()?.metadata.name}</div>

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
              <p>name: {service().metadata.name}</p>
              <p class="font-normal text-gray-700 dark:text-gray-400 my-1">
                images:{" "}
                <For each={service().spec.template.spec.containers}>
                  {(container) => <span>{container.image}</span>}
                </For>
              </p>
              <p class="font-normal text-gray-700 dark:text-gray-400 my-1">
                url:{" "}
                <a
                  class="text-sky-400"
                  href={service().status.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {service().status.url}
                </a>
              </p>
              <p class="font-bold text-sm text-gray-700 dark:text-gray-400 my-1">
                <Show
                  when={service().status.conditions?.length}
                  fallback={<span>n/a/</span>}
                >
                  <Status conditions={service().status.conditions} />
                </Show>
              </p>
            </div>

            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              class="tab"
              aria-label="Environment"
            />
            <div
              role="tabpanel"
              class="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              {JSON.stringify(service().spec.template.spec.containers[0].env)}
            </div>

            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              class="tab"
              aria-label="Resources"
            />
            <div
              role="tabpanel"
              class="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              <p>
                cpu limit:{" "}
                <For each={service().spec.template.spec.containers}>
                  {(container) => (
                    <span>
                      {container.name}: {container?.resources?.limits?.cpu}
                    </span>
                  )}
                </For>
              </p>
              <p>
                cpu limit:{" "}
                <For each={service().spec.template.spec.containers}>
                  {(container) => (
                    <span>
                      {container.name}: {container?.resources?.limits?.memory}
                    </span>
                  )}
                </For>
              </p>
            </div>

            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              class="tab"
              aria-label="Scaling"
            />
            <div
              role="tabpanel"
              class="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              <p>
                target load per pod:{" "}
                {
                  service().spec.template.metadata?.annotations?.[
                    "autoscaling.knative.dev/target"
                  ]
                }{" "}
                {
                  service().spec.template.metadata?.annotations?.[
                    "autoscaling.knative.dev/metric"
                  ]
                }
              </p>
              <p>
                minimum container count:{" "}
                {
                  service().spec.template.metadata?.annotations?.[
                    "autoscaling.knative.dev/min-scale"
                  ]
                }
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
        </section>
      </Show>
    </div>
  );
};
