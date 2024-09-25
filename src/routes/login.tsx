import { Show } from "solid-js";
import LoginForm from "~/components/LoginForm";
import { getUser } from "~/lib/auth";
import { createAsync, redirect, type RouteDefinition } from "@solidjs/router";

const getData = async () => {
  "use server";
  let user;
  try {
    user = await getUser();
  } catch (e) {}
  if (user) throw redirect("/cloud");
};

export const route = {
  load: () => {
    getData();
  },
} satisfies RouteDefinition;

export default () => {
  const data = createAsync(() => getData());
  return (
    <main>
      <title>Login</title>
      <section>
        <h1 class="text-6xl uppercase text-center my-12">Login</h1>
        <div class="flex justify-center">
          <LoginForm />
        </div>
      </section>
    </main>
  );
};
