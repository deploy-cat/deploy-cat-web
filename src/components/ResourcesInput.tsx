import { createSignal, Show } from "solid-js";

export const ResourcesInput = ({ data }) => {
  const [CPU, setCPU] = createSignal(data?.cpuLimit);
  const [memory, setMemory] = createSignal(data?.memoryLimit);

  return (
    <>
      <div class="">
        <p class="my-2">CPU Limit: {CPU()} mCPU</p>
        <label class="label cursor-pointer">
          <span class="label-text">use default</span>
          <input
            type="checkbox"
            checked={CPU() === undefined}
            onChange={(event) => setCPU(event.target.checked ? undefined : 100)}
            class="checkbox"
          />
        </label>
      </div>
      <Show when={CPU() !== undefined}>
        <label class="form-control w-full">
          <input
            type="range"
            name="cpuLimit"
            min="50"
            max="500"
            value={CPU()}
            class="range"
            step="50"
            onChange={(e) => setCPU(Number(e.target.value))}
          />
          <div class="w-full flex justify-between text-xs px-2">
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
          </div>
          <div class="label">
            <span class="label-text">50m</span>
            <span class="label-text-alt">500m</span>
          </div>
        </label>
      </Show>

      <p class="my-2">Memory Limit: {memory()} MiB</p>
      <label class="label cursor-pointer">
        <span class="label-text">use default</span>
        <input
          type="checkbox"
          checked={memory() === undefined}
          onChange={(event) =>
            setMemory(event.target.checked ? undefined : 250)
          }
          class="checkbox"
        />
      </label>
      <Show when={memory() !== undefined}>
        <label class="form-control w-full">
          <input
            type="range"
            name="memoryLimit"
            min="200"
            max="500"
            value={memory()}
            class="range"
            step="50"
            onChange={(e) => setMemory(Number(e.target.value))}
          />
          <div class="w-full flex justify-between text-xs px-2">
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
          </div>
          <div class="label">
            <span class="label-text">200Mi</span>
            <span class="label-text-alt">500Mi</span>
          </div>
        </label>
      </Show>
    </>
  );
};
