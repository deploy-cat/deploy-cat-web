import { createServerAction$, redirect } from "solid-start/server";

export const CreateApp = () => {
  const [enrolling, { Form }] = createServerAction$(
    async (form: FormData, { request }) => {
      const subject = form.get("subject") as string;
      return redirect("/enrollment");
    },
  );

  return (
    <div class="w-64 m-3">
      <div class="overflow-y-auto rounded-xl bg-gray-50 dark:bg-gray-800 p-6">
        <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Create app
        </h2>
        <h3 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Add via cli
        </h3>
        <ol class="list-decimal ml-6">
          <li>
            <code class="bg-slate-600 px-1 rounded">
              npx @deploycat/cli create my-app
            </code>
          </li>
        </ol>
        <hr class="my-5" />
        <h3 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Add manually
        </h3>
        <Form>
          <div class="mb-6">
            <label
              for="name"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Name
            </label>
            <input
              type="email"
              id="email"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="name@flowbite.com"
              required
            />
          </div>
          <div class="mb-6">
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your password
            </label>
            <input
              type="password"
              id="password"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
          </div>
          <div class="flex items-start mb-6">
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
          <button type="submit" class="btn btn-primary">Submit</button>
        </Form>
      </div>
    </div>
  );
};

export default CreateApp;
