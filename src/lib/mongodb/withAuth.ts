import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "./mongodb";

type AsyncHandler<TArgs extends unknown[] = unknown[]> = (
  session: Session,
  ...args: TArgs
) => Promise<Response>;

export function withAuth<TArgs extends unknown[]>(
  fn: AsyncHandler<TArgs>,
  options?: { requireAuth?: boolean }
): (...args: TArgs) => Promise<Response> {
  return async (...args: TArgs): Promise<Response> => {
    try {
      // Authentication Check 
      let session: Session | null = null;

      if (options?.requireAuth) {
        session = await getServerSession(authOptions);

        if (!session?.user) {
          return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
          );
        }
      }

      //  Connect DB
      await connectDB();

      // Call handler
      const result = await fn(session as Session, ...args);

      if (!result) {
        return NextResponse.json(
          { error: "Handler did not return a response" },
          { status: 500 }
        );
      }

      return result;
    } catch (error: unknown) {
      console.error("Server Error:", error);

      let message = "Internal Server Error";
      let status = 500;

      if (error instanceof Error) {
        message = error.message;
      }

      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        typeof (error as { status?: unknown }).status === "number"
      ) {
        status = (error as { status: number }).status;
      }

      return NextResponse.json(
        { error: message },
        { status }
      );
    }
  };
}