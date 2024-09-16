import { createResource, createSignal, For, Show } from "solid-js";
import { knative } from "~/k8s";
import {
  cache,
  createAsync,
  A,
  useParams,
  action,
  useSubmission,
  type RouteDefinition,
  type RouteSectionProps,
  redirect,
} from "@solidjs/router";
import { getUser } from "~/lib/server";
import { Status } from "~/components/cloud/service/Status";
import { Monitoring } from "~/components/cloud/service/Monitoring";
import { rangeQuery } from "~/lib/prometheus";
import { CheckBadgeIcon } from "@deploy-cat/heroicons-solid/24/solid/esm";
import { StatusBadge } from "~/components/cloud/service/StatusBadge";
import type { Service as KnativeService } from "~/knative";

const getService = cache(async (app: string) => {
  "use server";
  const user = await getUser();
  return await knative.getService(app, user.username);
}, "service");

const deleteServiceFromForm = async (form: FormData) => {
  "use server";
  const service = {
    name: form.get("name") as string,
  };
  const user = await getUser();
  await knative.deleteService(service.name, user.username);
  throw redirect("/cloud/apps");
};

const deleteServiceAction = action(deleteServiceFromForm, "createService");

export const route = {
  load: ({ params }) => {
    getService(params.app);
  },
} satisfies RouteDefinition;

export default (props: RouteSectionProps) => {
  const params = useParams();
  const service = createAsync(() => getService(params.app));
  const deleteServiceStatus = useSubmission(deleteServiceAction);

  return (
    <>
      <Show when={service()} fallback={<span>no service with this name</span>}>
        <section class="my-5">
          <div class="my-5 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <h1 class="text-4xl font-medium">{service()?.name}</h1>
              <StatusBadge conditions={service()?.raw.status.conditions} />
            </div>
            <div class="dropdown dropdown-end">
              <div
                tabindex="0"
                role="button"
                class="btn btn-primary btn-outline"
              >
                Actions
              </div>
              <ul
                tabindex="0"
                class="dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow"
              >
                <li>
                  <form action={deleteServiceAction} method="post">
                    <input type="hidden" name="name" value={service()?.name} />
                    <button
                      type="submit"
                      disabled={deleteServiceStatus.pending}
                      class="btn btn-error"
                    >
                      Delete
                    </button>
                  </form>
                </li>
              </ul>
            </div>
          </div>

          <div class="my-2">
            <p class="font-normal my-1">
              <b>image:</b> {service()?.image}
            </p>
            <p class="font-normal my-1">
              <b>url:</b>{" "}
              <a
                class="text-sky-400"
                href={service()?.raw.status.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {service()?.raw.status.url}
              </a>
            </p>
          </div>
        </section>

        <section class="my-2">
          <div role="tablist" class="tabs tabs-lifted">
            <A
              href={`/cloud/apps/${params.app}`}
              end={true}
              activeClass="tab-active"
              role="tab"
              class="tab [--tab-border-color:teal]"
            >
              Overview
            </A>
            <A
              href={`/cloud/apps/${params.app}/stats`}
              activeClass="tab-active"
              role="tab"
              class="tab [--tab-border-color:teal]"
            >
              Insights
            </A>
            <A
              href={`/cloud/apps/${params.app}/settings`}
              activeClass="tab-active"
              role="tab"
              class="tab [--tab-border-color:teal]"
            >
              Settings
            </A>
            <A
              href={`/cloud/apps/${params.app}/logs`}
              activeClass="tab-active"
              role="tab"
              class="tab [--tab-border-color:teal]"
            >
              Logs
            </A>
          </div>

          {props.children}
        </section>
      </Show>
    </>
  );
};
