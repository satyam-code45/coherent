import { UserService } from "@/services/userService";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: ["openid", "email", "profile"].join(" "),
        },
      },
      httpOptions: {
        timeout: 10000,
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      try {
        const access_token = account?.access_token;
        const refresh_token = account?.refresh_token;

        if (!user.id || !user.name || !user.email || !user.image) return false;

        const userService = UserService.getInstance();
        await userService.createUser({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          access_token,
          refresh_token,
        });
      } catch (error) {
        console.error("Error creating user:", error);
      }
      return true;
    },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      //After sign in

      if (url.startsWith("/")) return `${baseUrl}/workspace`;
      if (new URL(url).origin === baseUrl) return `${baseUrl}/workspace`;

      if (url.includes("/api/auth/signout") || url.includes("/auth/sigin")) {
        return `${baseUrl}/auth/login`;
      }

      return baseUrl;
    },
    //everytime session is checked
    async session({ session, token }) {
      if (session.user) {
        if (token?.userId) {
          (session.user as Record<string, unknown>).id = token.userId;
        }

        if (token?.access_token) {
          (session.user as Record<string, unknown>).access_token =
            token.access_token;
        }

        if (token?.refresh_token) {
          (session.user as Record<string, unknown>).refresh_token =
            token.refresh_token;
        }
      }
      return session;
    },

    async jwt({ token, user, account }) {
      if (account) {
        if (account.access_token) {
          token.access_token = account.access_token;
        }

        if (account.refresh_token) {
          token.refresh_token = account.refresh_token;
        }
      }

      if (user) {
        try {
          const userService = UserService.getInstance();

          const dbUser = user.email
            ? await userService.findByEmail(user.email)
            : null;

          if (dbUser) {
            token.userId = dbUser._id.toString();
          }
        } catch (error) {
          console.log((error as Error)?.message);
        }
      }

      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
