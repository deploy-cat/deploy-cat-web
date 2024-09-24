import SideBar from "~/components/cloud/SideBar";
import { A, createAsync, useLocation } from "@solidjs/router";
import type { RouteSectionProps } from "@solidjs/router";
import {
  ChartPieIcon,
  ClipboardDocumentIcon,
  InboxIcon,
  QuestionMarkCircleIcon,
  Squares2X2Icon,
} from "@deploy-cat/heroicons-solid/24/solid/esm";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { getUser } from "~/lib";
import { UserBadge } from "~/components/UserBadge";
import { Show } from "solid-js";

export const route = {
  load: () => getUser(),
};

export default (props: RouteSectionProps) => {
  const user = createAsync(() => getUser());

  return (
    <main>
      <title>DeployCat Cloud</title>

      <div class="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
          <div class="navbar bg-base-300">
            <div class="navbar-start">
              <div class="dropdown">
                <label
                  for="my-drawer-2"
                  tabindex="0"
                  role="button"
                  class="btn btn-ghost btn-circle lg:hidden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                </label>
              </div>
            </div>
            <div class="navbar-center">
              <a class="btn btn-ghost text-xl">DeployCat</a>
            </div>
            <div class="navbar-end">
              {/* <button class="btn btn-ghost btn-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <button class="btn btn-ghost btn-circle">
                <div class="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span class="badge badge-xs badge-primary indicator-item"></span>
                </div>
              </button> */}
            </div>
          </div>
          <div class="container  mx-auto p-4">
            <Breadcrumbs />
            {props.children}
          </div>
        </div>
        <div class="drawer-side">
          <label
            for="my-drawer-2"
            aria-label="close sidebar"
            class="drawer-overlay"
          ></label>
          <div class="menu flex flex-col justify-between p-4 w-80 min-h-full bg-base-200 text-base-content">
            <ul>
              <li>
                <A href="/cloud" end={true}>
                  <ChartPieIcon class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span class="ml-3">Dashboard</span>
                </A>
              </li>
              <li>
                <A href="/cloud/apps">
                  <Squares2X2Icon class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span class="flex-1 ml-3 whitespace-nowrap">Apps</span>
                </A>
              </li>
            </ul>
            <Show when={user()}> {}
              <UserBadge user={user()} />
            </Show>
          </div>
        </div>
      </div>
    </main>
  );
};
