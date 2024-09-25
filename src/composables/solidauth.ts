import { getSession } from "@solid-auth/base";
import { createServerData$ } from "solid-start/server";
import { authOptions } from "~/lib/auth";

export const useSession = () =>
  createServerData$(
    async (_, session) => await getSession(session.request, authOptions),
    { key: () => ["auth_user"] },
  );
