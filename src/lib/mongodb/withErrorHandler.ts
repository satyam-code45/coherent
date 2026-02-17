import { NextResponse } from "next/server";
import { connectDB } from "./mongodb";

type AsyncHandler<TArgs extends unknown[] = unknown[]> = (
  ...args: TArgs
) => Promise<Response>;

export function withErrorHandler<TArgs extends unknown[]>(
  fn: AsyncHandler<TArgs>,
): AsyncHandler<TArgs> {
  return async (...args: TArgs): Promise<Response> => {
    try {
      await connectDB();

      const result = await fn(...args);

      // Ensure Response is always returned
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
