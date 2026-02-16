import { withErrorHandler } from "@/lib/mongodb/withErrorHandler";
import { UserService } from "@/services/userService";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
      user: { id: string; name: string; email: string; image: string };
      account: { access_token?: string; refresh_token?: string } | null;
    }) {
      try {
        const userData = { ...user };
        const access_token = account?.access_token;
        const refresh_token = account?.refresh_token;

        const userService = UserService.getInstance();
        await userService.createUser({
          ...userData,
          access_token,
          refresh_token,
        });
      } catch (error) {
        console.error('Error creating user:', error);
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
    async session({session, token}: {
      session: {
        user: {
          id?: string;
          name?: string;
          email?: string;
          image?: string;
          access_token?: string;
          refresh_token?: string;
        };
      };
      token: {
        userId?: string;
        access_token?: string;
        refresh_token?: string;
      };
    }){
        if(token?.userId){
            session.user.id = token.userId;
        }

        if(token?.access_token){
            session.user.access_token = token.access_token;
        }

        if(token?.refresh_token){
            session.user.refresh_token = token.refresh_token;
        }
        return session;
    },

    async jwt({token, user, account}: {
      token: {
        userId?: string;
        access_token?: string;
        refresh_token?: string;
      };
      user?: {
        id: string;
        name: string;
        email: string;
        image: string;
      };
      account?: {
        access_token?: string;
        refresh_token?: string;
      } | null;
    }){
        if(account){
            if(account.access_token){
                token.access_token = account.access_token;
            }

            if (account.refresh_token) {
                token.refresh_token = account.refresh_token;
            }
        }

        if(user){
            try{
                const userService = UserService.getInstance();

                const dbUser = await userService.findByEmail(user.email);

                if(dbUser){
                    token.userId = dbUser._id.toString();
                }
            }catch (error){
                console.log((error as Error)?.message);
                
            }
        }

        return token;
    }
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
