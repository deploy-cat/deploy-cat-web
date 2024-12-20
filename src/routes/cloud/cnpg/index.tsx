import { For } from "solid-js";
import { knative } from "~/k8s";
import { Service } from "~/components/cloud/service/Service";
import { CreateDatabaseForm } from "../../../components/cloud/CreateDatabaseForm";
import { cache, createAsync, A, type RouteDefinition } from "@solidjs/router";
import { getUser } from "~/lib/auth";
import { StatusBadge } from "~/components/cloud/service/StatusBadge";
import { cnpg } from "~/lib/k8s";
import humanizeDuration from "humanize-duration";

const getDBs = cache(async () => {
  "use server";
  const user = await getUser();
  try {
    return await cnpg.getDatabases(user.name);
  } catch (e) {
    return [];
  }
}, "databases");

export const route = {
  load: () => {
    getDBs();
  },
} satisfies RouteDefinition;

export default () => {
  const dbs = createAsync(() => getDBs());

  return (
    <>
      <section class="my-7">
        <div class="flex justify-between items-center">
          <h1 class="text-4xl font-medium">Postgres</h1>
          <button
            class="btn btn-primary btn-outline"
            onClick={() =>
              (
                document.getElementById(
                  "create-database-modal"
                ) as HTMLDialogElement
              ).showModal()
            }
          >
            New Postgres
          </button>
        </div>
      </section>
      <section class="my-7">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Updated</th>
                <th class="hidden md:block">Image</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <For each={dbs?.()}>
                {(db) => (
                  <tr>
                    <td class="flex gap-2">
                      {db.metadata.name}{" "}
                      <StatusBadge
                        conditions={db.status.conditions}
                        disableDropdown={true}
                      />
                    </td>
                    <td>
                      <div
                        class="tooltip"
                        data-tip={new Date(
                          db.status.conditions.find(
                            (condition) => condition.type === "Ready"
                          )?.lastTransitionTime
                        ).toLocaleString()}
                      >
                        {humanizeDuration(
                          new Date(
                            db.status.conditions.find(
                              (condition) => condition.type === "Ready"
                            )?.lastTransitionTime
                          ).getTime() - Date.now(),
                          { round: true, largest: 1 }
                        )}{" "}
                        ago
                      </div>
                    </td>
                    <td class="hidden md:block">{db.spec.imageName}</td>
                    <td>
                      <A
                        href={`/cloud/cnpg/${db.metadata.name}`}
                        class="btn btn-xs btn-outline"
                      >
                        Details
                      </A>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
          {/* <pre>{JSON.stringify(dbs(), undefined, 2)}</pre> */}
        </div>
      </section>
      {/* <section class="grid 2xl:grid-cols-3 gap-2 w-full">
        <For each={services()?.services}>
          {(service) => <Service service={service} />}
        </For>
      </section> */}
      <CreateDatabaseForm />
    </>
  );
};
