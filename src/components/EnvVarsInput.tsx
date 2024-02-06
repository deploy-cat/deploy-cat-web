import { For, createSignal } from "solid-js";

const [envCount, setEnvCount] = createSignal(0);

export const EnvVarsInput = () => {
  return (
    <>
      <div>
        <For each={new Array(envCount())}>
          {() => (
            <div class="join my-1">
              <input
                class="input input-bordered join-item w-32"
                placeholder="Env"
                required
              />
              <input
                class="input select-bordered join-item w-full"
                placeholder="Value"
              />
              <button class="btn btn-warning join-item">Remove</button>
            </div>
          )}
        </For>

        <div class="join my-1">
          <button class="btn btn-outline btn-secondary join-item" onClick={() => setEnvCount(envCount() + 1)}>
            Add variable
          </button>
          <button class="btn btn-outline btn-secondary join-item" onClick={() => setEnvCount(envCount() + 1)}>
            Paste Variables
          </button>
        </div>
      </div>
    </>
  );
};
