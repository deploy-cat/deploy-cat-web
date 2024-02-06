import { createSignal, Show } from "solid-js";

export const ResourcesInput = () => {
  const [CPU, setCPU] = createSignal(100);
  const [memory, setMemory] = createSignal(250);

  return (
    <>
      <p class="my-2">CPU Limit: {CPU()} mCPU</p>
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
      <p class="my-2">Memory Limit: {memory()} MiB</p>
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
    </>
  );
};
