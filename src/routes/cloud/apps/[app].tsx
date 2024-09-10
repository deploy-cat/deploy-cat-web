import { createResource, createSignal, For, Show } from "solid-js";
import { knative } from "~/k8s";
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
import { Monitoring } from "~/components/cloud/service/Monitoring";
import { rangeQuery } from "~/lib/prometheus";

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
        <section class="m-2">
          <h1 class="text-3xl font-medium my-5">{service()?.name}</h1>

          <div class="my-2">
            <p class="font-normal text-gray-700 dark:text-gray-400 my-1">
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

          <div role="tablist" class="tabs tabs-lifted">
            {/* <A href={`/cloud/apps/${params.app}`} role="tab" class="tab">
              Overview
            </A> */}
            <A href={`/cloud/apps/${params.app}/stats`} role="tab" class="tab">
              Monitoring
            </A>
            <A
              href={`/cloud/apps/${params.app}/settings`}
              role="tab"
              class="tab"
            >
              Settings
            </A>
          </div>

          {props.children}
        </section>
      </Show>
    </div>
  );
};
