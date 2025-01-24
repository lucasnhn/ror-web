import NextAuth from "next-auth";
import { Provider } from "next-auth/providers";
import { env } from "../env";

declare module "next-auth" {
  interface Session {
    accessToken: string;
  }
}

const dexIdpProvider: Provider = {
  type: "oidc",
  id: "dex",
  name: "dex",
  issuer: env.AUTH_ISSUER,
  clientId: env.AUTH_CLIENT_ID,
  clientSecret: env.AUTH_CLIENT_SECRET,
};

const trusthost = Boolean(JSON.parse(env.TRUST_HOST));

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [dexIdpProvider],
  trustHost: trusthost,
  callbacks: {
    jwt({ token, account }) {
      if (account?.provider === "dex") {
        return { ...token, accessToken: account.access_token };
      }
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
});
