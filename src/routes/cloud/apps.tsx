import { For } from "solid-js";
import { createServerData$ } from "solid-start/server";
import { useRouteData } from "solid-start";
import { getSession } from "@auth/solid-start";
import { authOpts } from "../api/auth/[...solidauth]";
import CreateApp from "~/components/cloud/CreateApp";

export const routeData = () =>
  createServerData$(
    async (_, event) => {
      const session = await getSession(event.request, authOpts);
      return await fetch("http://127.0.0.1:3000/api/v1/apps", {
        headers: { user: "adb-sh" },
      }).then((data) => data.json());
    },
  );

export const Page = () => {
  const data = useRouteData();

  return (
    <section class="grid md:grid-cols-3 w-full m-0">
      <For each={data()?.apps}>
        {(app) => (
          <figure class="card basis-64 grow p-6 m-3 dark:hover:shadow-2xl transition-all duration-100 cursor-pointer">
            <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {app.name}
            </h2>
            <p class="font-normal text-gray-700 dark:text-gray-400 my-1">
              {app.image}
            </p>
            <p class="font-normal text-gray-700 dark:text-gray-400 my-1">
              <a
                class="text-sky-400"
                href={`https://${app.host}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {app.host}
              </a>
            </p>
          </figure>
        )}
      </For>
      <button class="card basis-64 grow block p-6 m-3 text-center border-none outline-dashed outline-stone-400 dark:bg-slate-400/10 dark:hover:shadow-2xl transition-all duration-100">
        <span class="text-3xl text-slate-400">+</span>
      </button>
    </section>
  );
};

export default Page;
