import { signIn } from "@auth/solid-start/client";

export const LoginForm = () => (
  <div
    class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-xl shadow-md sm:p-6 md:p-8 dark:bg-slate-800 dark:border-gray-700">
    <form class="space-y-6" action="#">
      <h5 class="text-xl font-medium text-gray-900 dark:text-white">
        Sign in to deploy.cat
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
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="name@company.com"
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
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          required
        />
      </div>
      <div class="flex items-start">
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
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
      </div>
      <button
        type="submit"
        class="btn btn-primary w-full"
      >
        Login to your account
      </button>
      <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
        Not registered?{" "}
        <a
          href="#"
          class="text-blue-700 hover:underline dark:text-blue-500"
        >
          Create account
        </a>
      </div>
    </form>
    <hr class="my-6"/>
      <button class="btn btn-secondary w-full" onClick={() => signIn("github")}>
        Sign in with GitHub
      </button>
  </div>
);

export default LoginForm;