import { useSubmission, cache, createAsync } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { login, register } from "~/lib";
import { ExclamationCircleIcon } from "@deploy-cat/heroicons-solid/24/solid/esm";
import { signIn, createSession } from "@solid-mediakit/auth/client";
import { config } from "~/lib/config";

const getAuthOptions = cache(async () => {
  "use server";
  return Object.keys(config.auth);
}, "auth-options");

export const LoginForm = () => {
  const loginStatus = useSubmission(login);
  const registerStatus = useSubmission(register);
  const authOptions = createAsync(() => getAuthOptions());

  const [showRegister, setShowRegister] = createSignal(false);

  return (
    <div class="w-full max-w-sm p-4 card">
      <Show when={authOptions()?.includes("credentials")}>
        <Show
          when={showRegister()}
          fallback={
            <form class="space-y-6" action={login} method="post">
              <div>
                <label
                  for="username"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  class="input input-bordered w-full"
                  required
                />
              </div>
              <div>
                <label
                  for="password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  class="input input-bordered w-full"
                  required
                />
              </div>
              <Show when={loginStatus.error}>
                <div role="alert" class="alert alert-error">
                  <ExclamationCircleIcon class="w-6 h-6" />
                  <span>{loginStatus.error.toString()}</span>
                </div>
              </Show>
              <button type="submit" class="btn btn-primary w-full">
                <Show when={loginStatus.pending}>
                  <span class="loading loading-spinner"></span>
                </Show>
                Login to your account
              </button>
              <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                Not registered?{" "}
                <button
                  onclick={() => setShowRegister(true)}
                  class="text-blue-700 hover:underline dark:text-blue-500"
                >
                  Create account
                </button>
              </div>
            </form>
          }
        >
          <form class="space-y-6" action={register} method="post">
            <h5 class="text-xl font-medium text-gray-900 dark:text-white">
              Create Account
            </h5>
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                class="input input-bordered w-full"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label
                for="username"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                class="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="input input-bordered w-full"
                required
              />
            </div>
            <Show when={registerStatus.error}>
              <div role="alert" class="alert alert-error">
                <ExclamationCircleIcon class="w-6 h-6" />
                <span>{registerStatus.error.toString()}</span>
              </div>
            </Show>
            <button type="submit" class="btn btn-primary w-full">
              <Show when={registerStatus.pending}>
                <span class="loading loading-spinner"></span>
              </Show>
              Create Account
            </button>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
              Already got an account?{" "}
              <button
                onclick={() => setShowRegister(false)}
                class="text-blue-700 hover:underline dark:text-blue-500"
              >
                Login
              </button>
            </div>
          </form>
        </Show>
        <div class="divider">OR</div>
      </Show>
      <Show when={authOptions()?.includes("github")}>
        <button
          class="btn btn-secondary w-full"
          onClick={() => signIn("github")}
        >
          Sign in with GitHub
        </button>
      </Show>
    </div>
  );
};

export default LoginForm;
