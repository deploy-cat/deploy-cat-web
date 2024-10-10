"use server";

import { auth, getSession, type SolidAuthConfig } from "@solid-mediakit/auth";
import GitHub from "@auth/core/providers/github";
import { config } from "~/lib/config";
import type { Provider } from "@auth/core/providers";
import { getWebRequest } from "vinxi/http";
import { redirect } from "@solidjs/router";
import { z } from "zod";
import { db } from "./db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { k8sCore } from "./k8s";
import { schemaUser } from "./types";

declare module "@auth/core/types" {
  export interface Session {
    user?: DefaultSession["user"];
  }
}

const providers = [] as Array<Provider>;

if (config?.auth.github) {
  const github = GitHub({
    clientId: config.auth.github.id,
    clientSecret: config.auth.github.secret,
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

const authOptions: SolidAuthConfig = {
  adapter: PrismaAdapter(db),
  providers,
  debug: false,
  trustHost: true,
  basePath: "/api/auth",
  callbacks: {
    signIn: async (user) => {
      if (!user.user.name) return false;
      let existingNamespace;
      try {
        existingNamespace = await k8sCore.readNamespace(user.user.name);
      } catch (e) {}
      // disallow register when namespace exists
      if (
        !(await db.user.findUnique({ where: { id: user.user.id } })) &&
        existingNamespace
      )
        return false;

      if (existingNamespace) return true;

      await k8sCore.createNamespace({
        apiVersion: "v1",
        kind: "Namespace",
        metadata: {
          name: user.user.name,
          labels: {
            "app.kubernetes.io/managed-by": "deploycat",
          },
        },
      });
      return true;
    },
  },
};

export const getAuthOptions = () => authOptions;

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
