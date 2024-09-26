import { Show } from "solid-js";
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
import { getUser } from "~/lib/auth";
import { cnpg } from "~/lib/k8s";
import { StatusBadge } from "~/components/cloud/service/StatusBadge";
import { CircleStackIcon } from "@deploy-cat/heroicons-solid/24/solid/esm";

const getDB = cache(async (app: string) => {
  "use server";
  const user = await getUser();
  return await cnpg.getDatabase(app, user.name);
}, "db");

const deleteDBFromForm = async (form: FormData) => {
  "use server";
  const service = {
    name: form.get("name") as string,
  };
  const user = await getUser();
  await cnpg.deleteDatabase(service.name, user.name);
  throw redirect("/cloud/cnpg");
};

const deleteDBAction = action(deleteDBFromForm, "deleteDB");

export const route = {
  load: ({ params }) => {
    getDB(params.name);
  },
} satisfies RouteDefinition;

export default (props: RouteSectionProps) => {
  const params = useParams();
  const db = createAsync(() => getDB(params.name));
  const deleteDBStatus = useSubmission(deleteDBAction);

  return (
    <>
      <Show when={db()} fallback={<span>no service with this name</span>}>
        <section class="my-5">
          <div class="my-5 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <CircleStackIcon class="h-8 w-8" />
              <h1 class="text-4xl font-medium">{db()?.metadata.name}</h1>
              <StatusBadge conditions={db()?.status.conditions} />
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
                  <form action={deleteDBAction} method="post">
                    <input
                      type="hidden"
                      name="name"
                      value={db()?.metadata.name}
                    />
                    <button
                      type="submit"
                      disabled={deleteDBStatus.pending}
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
              <b>Image:</b> {db()?.spec.imageName}
            </p>
            <p class="font-normal my-1">
              <b>Instances:</b> {db()?.spec.instances}
            </p>
            <p class="font-normal my-1">
              <b>Volume Size:</b> {db()?.spec.storage.size}
            </p>
          </div>
          {/* <pre>{JSON.stringify(db(), undefined, 2)}</pre> */}
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
