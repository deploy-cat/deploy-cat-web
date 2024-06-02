import { useLocation, A } from "@solidjs/router";
import { For } from "solid-js";

export const Breadcrumbs = () => {
  const location = useLocation();

  return (
    <div class="text-sm breadcrumbs">
      <ul>
        <For
          each={location.pathname.split("/").map((name, i, arr) => ({
            path: arr.slice(0, i + 1).join("/"),
            name,
          }))}
        >
          {(segment) => (
            <li>
              <A href={segment.path}>{segment.name}</A>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};
