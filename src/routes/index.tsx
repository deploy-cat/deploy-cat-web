import LoginForm from "~/components/LoginForm";
import { getUser } from "~/lib/auth";
import {
  createAsync,
  redirect,
  cache,
  type RouteDefinition,
} from "@solidjs/router";

const getData = cache(async () => {
  "use server";
  let user;
  try {
    user = await getUser();
  } catch (e) {}
  console.log(user);
  if (user) throw redirect("/cloud");
}, "login-redirect");

export const route = {
  load: () => {
    getData();
  },
} satisfies RouteDefinition;

export default () => {
  const data = createAsync(() => getData());

  return (
    <main class="m-0">
      <title>Login</title>
      <div class="flex h-screen">
        <section class="grow w-2/5">
          <h1 class="text-6xl uppercase text-center my-12">Login</h1>
          <div class="flex justify-center">
            <LoginForm />
          </div>
        </section>
        <section class="grow w-3/5 m-0 xl:flex hidden justify-center items-center bg-slate-700">
          <img src="/deploy-cat.webp" class="w-48 h-48 rounded" alt="" />
        </section>
      </div>
    </main>
  );
};
