import { For, Show } from "solid-js";

export const Status = ({ conditions }) => (
  <div class="flex">
    <For each={conditions}>
      {(condition) => (
        <figure class="flex items-center mr-4">
          <symbol
            class={`status inline-flex items-center justify-center w-2 h-2 mr-2 rounded`}
            classList={{
              ready: condition.status === "True",
            }}
          />
          <span class="font-normal text-sm text-gray-700 dark:text-gray-400">
            {condition.type}
            <Show when={condition.reason}>{" "}({condition.reason})</Show>
          </span>
        </figure>
      )}
    </For>
  </div>
);
