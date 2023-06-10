import { type SolidAuthConfig } from "@solid-auth/base";
import GitHubProvider from "@auth/core/providers/github";

export const authOptions: SolidAuthConfig = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  debug: false,
};
