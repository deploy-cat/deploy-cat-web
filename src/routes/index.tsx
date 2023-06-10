import { A, Title, useRouteData } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { Show } from "solid-js";
import LoginForm from "~/components/LoginForm";
import { useSession } from "~/composables/solidauth";
import { getSession } from "@solid-auth/base";
import { authOptions } from "../server/auth";

export const routeData = () =>
  createServerData$(
    async (_, event) => {
      const session = await getSession(event.request, authOptions);
      throw redirect("/login");
      return session;
    },
    { key: () => ["auth_user"] },
  );

export const Home = () => {
  const session = useRouteData<typeof useSession>();

  return (
    <main class="m-0">
      <Title>Login</Title>
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

export default Home;
