import { useNavigate, useSubmission } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { login, register } from "~/lib";

export const LoginForm = () => {
  const loginStatus = useSubmission(login);
  const registerStatus = useSubmission(register);

  const [showRegister, setShowRegister] = createSignal(false);

  return (
    <div class="w-full max-w-sm p-4 card">
      <Show
        when={showRegister()}
        fallback={
          <form class="space-y-6" action={login} method="post">
            <h5 class="text-xl font-medium text-gray-900 dark:text-white">
              Sign in to DeployCat
            </h5>
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
            {/* <div class="flex items-start">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="remember"
                    type="checkbox"
                    value=""
                    class="checkbox checkbox-primary"
                    required
                  />
                </div>
                <label
                  for="remember"
                  class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#"
                class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
              >
                Lost Password?
              </a>
            </div> */}
            <button type="submit" class="btn btn-primary w-full">
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
          <button type="submit" class="btn btn-primary w-full">
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
      <button class="btn btn-secondary w-full" onClick={() => signIn()}>
        Sign in with GitHub
      </button>
    </div>
  );
};

export default LoginForm;
