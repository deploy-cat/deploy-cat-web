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
          <div>{service()?.name}</div>

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
              <p>name: {service()?.name}</p>
              <p class="font-normal text-gray-700 dark:text-gray-400 my-1">
                image {service()?.image}
              </p>
              <p class="font-normal text-gray-700 dark:text-gray-400 my-1">
                url:{" "}
                <a
                  class="text-sky-400"
                  href={service()?.raw.status.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {service()?.raw.status.url}
                </a>
              </p>
              <p class="font-bold text-sm text-gray-700 dark:text-gray-400 my-1">
                <Show
                  when={service()?.raw.status.conditions?.length}
                  fallback={<span>n/a/</span>}
                >
                  <Status conditions={service()?.raw.status.conditions} />
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
              {JSON.stringify(service()?.envVars)}
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
              <p>cpu limit: {service()?.cpuLimit}</p>
              <p>memory limit: {service()?.memoryLimit}</p>
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
                target load per pod: {service()?.maxRequests}
                {/* {
                  service().spec.template.metadata?.annotations?.[
                    "autoscaling.knative.dev/metric"
                  ]
                } */}
              </p>
              <p>minimum container count: {service()?.minScale}</p>
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
