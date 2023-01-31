import {
  ChartPieIcon,
  ClipboardDocumentIcon,
  InboxIcon,
  QuestionMarkCircleIcon,
  Squares2X2Icon,
} from "@deploy-cat/heroicons-solid/24/solid/esm";
import { A } from "@solidjs/router";

export const SideBar = () => (
  <aside class="w-64 m-3" aria-label="Sidebar">
    <div class="overflow-y-auto rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
      <ul class="space-y-2">
        <li>
          <A
            href="/cloud/dashboard"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChartPieIcon class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            <span class="ml-3">Dashboard</span>
          </A>
        </li>
        <li>
          <A
            href="/cloud/apps"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Squares2X2Icon class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            <span class="flex-1 ml-3 whitespace-nowrap">Apps</span>
          </A>
        </li>
        <li>
          <A
            href="/cloud/inbox"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <InboxIcon class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            <span class="flex-1 ml-3 whitespace-nowrap">Inbox</span>
            <span class="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-600 bg-blue-200 rounded-full dark:bg-blue-900 dark:text-blue-200">
              3
            </span>
          </A>
        </li>
      </ul>
      <ul class="pt-4 mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
        <li>
          <A
            href="/docs"
            class="flex items-center p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
          >
            <ClipboardDocumentIcon class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            <span class="ml-3">Documentation</span>
          </A>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
          >
            <QuestionMarkCircleIcon class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            <span class="ml-3">Help</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>
);

export default SideBar;
