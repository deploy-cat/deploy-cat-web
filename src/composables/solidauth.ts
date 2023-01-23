import { getSession } from "@auth/solid-start"
import { createServerData$ } from "solid-start/server"
import { authOpts } from "~/routes/api/auth/[...solidauth]"

export const useSession = () =>
  createServerData$(
    async (_, session) => await getSession(session.request, authOpts),
    { key: () => ["auth_user"] }
  );
