import { For, type Signal, createSignal } from "solid-js";
import { TrashIcon } from "@deploy-cat/heroicons-solid/24/solid/esm";

const [envCount, setEnvCount] = createSignal(0);
const [env, setEnv] = createSignal(
  [] as Array<{ key: Signal<string>; value: Signal<string> }>
);

const parseClipboard = (text: string) =>
  text
    .split("\n")
    .filter((line) => line !== "")
    .map((line) => {
      const [key, value] = line.split("=");
      return {
        key: createSignal(key),
        value: createSignal(value),
      };
    });

export const EnvVarsInput = () => {
  return (
    <>
      <div>
        <input
          type="hidden"
          name="env"
          value={JSON.stringify(
            Object.fromEntries(
              env()?.map(({ key, value }) => [key[0](), value[0]()])
            )
          )}
        />
        <For
          each={env()}
          fallback={
            <div
              class="my-4"
              onPaste={(event) =>
                setEnv(
                  parseClipboard(event.clipboardData?.getData("text") ?? "")
                )
              }
            >
              <p>No Environment Variables yet!</p>
              <p>
                Use <b>Ctrl+V</b> to paste an Env File or add manually.
              </p>
            </div>
          }
        >
          {({ key, value }, index) => (
            <div class="join my-1">
              <input
                type="text"
                value={key[0]()}
                onInput={(event) => key[1](event.target.value)}
                class="input input-bordered join-item w-32"
                placeholder="Env"
                required
              />
              <input
                type="text"
                name={`env-${key[0]()}}`}
                value={value[0]()}
                onInput={(event) => value[1](event.target.value)}
                class="input select-bordered join-item w-full"
                placeholder="Value"
              />
              <div
                class="btn btn-error join-item"
                tabindex={0}
                onClick={() => setEnv(env().filter((_, i) => i !== index()))}
              >
                <TrashIcon class="flex-shrink-0 w-5 h-5" />
              </div>
            </div>
          )}
        </For>

        <div class="join my-1">
          <div
            class="btn btn-outline btn-secondary join-item"
            tabindex={0}
            onClick={() =>
              setEnv([
                ...env(),
                {
                  key: createSignal(""),
                  value: createSignal(""),
                },
              ])
            }
          >
            Add Variable
          </div>
          {/* <div
            class="btn btn-outline btn-secondary join-item"
            onClick={async () =>
              setEnv(parseClipboard(await navigator.clipboard.readText()))
            }
          >
            Paste Env File
          </div> */}
        </div>
      </div>
    </>
  );
};
