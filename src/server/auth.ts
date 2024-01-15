import { type SolidAuthConfig } from "@solid-auth/base";
import GitHubProvider from "@auth/core/providers/github";

const github = GitHubProvider({
  clientId: process.env.GITHUB_ID as string,
  clientSecret: process.env.GITHUB_SECRET as string,
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

export const authOptions: SolidAuthConfig = {
  providers: [github],
  debug: false,
  trustHost: true,
};
