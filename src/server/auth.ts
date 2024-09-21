import { type SolidAuthConfig } from '@solid-mediakit/auth'
import GitHub from '@auth/core/providers/github'

declare module '@auth/core/types' {
  export interface Session {
    user?: DefaultSession['user']
  }
}

export const authOptions: SolidAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  debug: false,
  basePath: import.meta.env.VITE_AUTH_PATH,
}
