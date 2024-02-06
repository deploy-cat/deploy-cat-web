import { createSignal, Show } from "solid-js";

export const ScalingInput = () => {
  const [minScale, setMinScale] = createSignal(1);
  const [maxReq, setMaxReq] = createSignal(300);

  return (
    <>
      <p class="my-2">Minimum Scale: {minScale()}</p>
      <label class="form-control w-full">
        <input
          type="range"
          name="minScale"
          min="0"
          max="4"
          value={minScale()}
          class="range"
          step="1"
          onChange={(e) => setMinScale(Number(e.target.value))}
        />
        <div class="w-full flex justify-between text-xs px-2">
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
        </div>
        <div class="label">
          <span class="label-text">0</span>
          <span class="label-text-alt">4</span>
        </div>
      </label>
      <Show when={minScale() === 0}>
        <div role="alert" class="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="stroke-current shrink-0 w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>Responses may be slower due to container startup.</span>
        </div>
      </Show>
      <p class="my-2">Max requestes: {maxReq()} req/s</p>
      <label class="form-control w-full">
        <input
          type="range"
          name="maxRequests"
          min="100"
          max="500"
          value={maxReq()}
          class="range"
          step="100"
          onChange={(e) => setMaxReq(Number(e.target.value))}
        />
        <div class="w-full flex justify-between text-xs px-2">
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
          <span>|</span>
        </div>
        <div class="label">
          <span class="label-text">100 req/s</span>
          <span class="label-text-alt">500 req/s</span>
        </div>
      </label>
    </>
  );
};
