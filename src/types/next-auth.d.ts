import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      access_token?: string;
      refresh_token?: string;
    } & DefaultSession["user"];
  }
}
