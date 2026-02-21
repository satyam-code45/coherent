import { readChatHistoryTool } from "@/lib/tools/ChatHistoryTools";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") as string;

    //validate the user id
    if (!userId) {
      return NextResponse.json(
        { ok: false, message: "User Id is required!" },
        { status: 400 },
      );
    }

    const retrivedMessages = await readChatHistoryTool.invoke({ userId });
    const messages = JSON.parse(retrivedMessages);
    return NextResponse.json({ messages });
  } catch (err: unknown) {
    let message = "Internal Server Error";

    if (err instanceof Error) {
      message = err.message;
    }
    return new Response(
      JSON.stringify({
        ok: false,
        error: message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
