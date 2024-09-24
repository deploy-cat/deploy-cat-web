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
  console.log(user);
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
          {/* <Show
            when={session()?.user}
            fallback={LoginForm}
          >
            <figure class="card flex flex-col items-center">
              <Show
                when={session()?.user?.image}
              >
                <img src={session().user.image} class="rounded-xl w-32" />
              </Show>
              <p>
                You are already logged in as "{session()?.user?.name}"
              </p>
              <button
                class="btn btn-primary"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </figure>
          </Show> */}
          <LoginForm />
        </div>
      </section>
    </main>
  );
};
