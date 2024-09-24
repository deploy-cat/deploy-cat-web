import { auth, getSession, type SolidAuthConfig } from "@solid-mediakit/auth";
import GitHub from "@auth/core/providers/github";
import { config } from "~/lib/config";
import type { Provider } from "@auth/core/providers";
import { getWebRequest } from "vinxi/http";
import { redirect } from "@solidjs/router";
import { z } from "zod";

declare module "@auth/core/types" {
  export interface Session {
    user?: DefaultSession["user"];
  }
}

const providers = [] as Array<Provider>;

if (config?.oauth.github) {
  const github = GitHub({
    clientId: config.oauth.github.id,
    clientSecret: config.oauth.github.secret,
  });

  github.profile = (profile) => {
    return {
      id: profile.id.toString(),
      name: profile.login,
      // name: `gh-${profile.login}`,
      email: profile.email,
      image: profile.avatar_url,
    };
  };
  providers.push(github);
}

export const authOptions: SolidAuthConfig = {
  providers,
  debug: false,
  trustHost: true,
  basePath: "/api/auth",
};

const schemaUser = z.object({
  name: z.string(),
  id: z.string().optional(),
  email: z.string().optional(),
  image: z.string().optional(),
});

export const getUser = async () => {
  "use server";
  const request = getWebRequest();
  const session = await getSession(request, authOptions);
  try {
    return schemaUser.parse(session?.user);
  } catch (e) {
    throw redirect("/");
  }
};
