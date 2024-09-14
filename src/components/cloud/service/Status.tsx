import { For, Show } from "solid-js";

export const Status = ({ conditions }) => (
  <div class="flex flex-col gap-2">
    <For each={conditions}>
      {(condition) => (
        <div
          class="badge badge-outline"
          classList={{
            "badge-success": condition.status === "True",
            "badge-error": condition.status !== "True",
          }}
        >
          {condition.type}
          <Show when={condition.reason}> ({condition.reason})</Show>
        </div>
      )}
    </For>
  </div>
);
