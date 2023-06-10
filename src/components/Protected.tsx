import type { Session } from "@auth/core";
import { getSession } from "@solid-auth/base";
import { Component, Show } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { authOptions } from "~/server/auth";

const Protected = (Comp: IProtectedComponent) => {
  const routeData = () =>
    createServerData$(
      async (_, event) => {
        const session = await getSession(event.request, authOptions);
        if (!session?.user) throw redirect("/login");
        return session;
      },
      { key: () => ["auth_user"] },
    );

  return {
    routeData,
    Page: () => {
      const session = useRouteData<typeof routeData>();
      return (
        <Show when={session()?.user && session()} keyed>
          {(props) => <Comp {...props} />}
        </Show>
      );
    },
  };
};

type IProtectedComponent = Component<Session>;

export default Protected;
