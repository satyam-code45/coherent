import { UserService } from "@/services/userService";
import NextAuth, { Account, Profile, User, Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

interface ExtendedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  access_token?: string;
  refresh_token?: string;
}

interface ExtendedSession extends Omit<Session, "user"> {
  user?: ExtendedUser;
}

interface ExtendedJWT extends JWT {
  userId?: string;
  access_token?: string;
  refresh_token?: string;
}

export const authOptions = {
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
    async signIn({
      user,
      account,
    }: {
      user: User | AdapterUser;
      account: Account | null;
      profile?: Profile;
    }) {
      try {
        if (!user.email) {
          return false;
        }

        const userData = {
          id: user.id || "",
          name: user.name || "",
          email: user.email,
          image: user.image || "",
        };
        const access_token = account?.access_token;
        const refresh_token = account?.refresh_token;

        const userService = UserService.getInstance();
        await userService.createUser({
          ...userData,
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
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: ExtendedJWT;
    }) {
      if (session.user) {
        if (token?.userId) {
          session.user.id = token.userId;
        }

        if (token?.access_token) {
          session.user.access_token = token.access_token;
        }

        if (token?.refresh_token) {
          session.user.refresh_token = token.refresh_token;
        }
      }
      return session;
    },

    async jwt({
      token,
      user,
      account,
    }: {
      token: ExtendedJWT;
      user?: User | AdapterUser;
      account?: Account | null;
    }) {
      if (account) {
        if (account.access_token) {
          token.access_token = account.access_token;
        }

        if (account.refresh_token) {
          token.refresh_token = account.refresh_token;
        }
      }

      if (user && user.email) {
        try {
          const userService = UserService.getInstance();

          const dbUser = await userService.findByEmail(user.email);

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
