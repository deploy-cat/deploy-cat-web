// import Protected from "~/components/Protected";
import { getUser } from "~/lib";
import { createAsync, type RouteDefinition } from "@solidjs/router";
import { createSession } from "@solid-mediakit/auth/client";

// export const route = {
//   load: () => getUser(),
// } satisfies RouteDefinition;

export default function Home() {
  // const user = createAsync(() => getUser(), { deferStream: true });
  const session = createSession();
  return (
    <main class="w-full p-4 space-y-2">
      <h2 class="font-bold text-3xl">Hello {session()?.user?.name}</h2>
      <p>{JSON.stringify(session())}</p>
      {/* <form action={logout} method="post">
        <button name="logout" type="submit">
          Logout
        </button>
      </form> */}
    </main>
  );
}
