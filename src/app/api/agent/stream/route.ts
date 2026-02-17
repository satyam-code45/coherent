import { withErrorHandler } from "@/lib/mongodb/withErrorHandler";
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { HumanMessage } from "@langchain/core/messages";
import { ChatCerebras } from "@langchain/cerebras";
import { createAgent, tool } from "langchain";
import { NextResponse } from "next/server";

export const POST = withErrorHandler(async (req: Request) => {
  try {
    const model = new ChatCerebras({
      model: "llama-3.1-8b",
      temperature: 0,
      maxTokens: undefined,
      // maxRetries:2,
      apiKey: process.env.CEREBRAS_API_KEY,
    });

    const agent = createAgent({
      model,
      // tools: [searchTool]
    });

    const { message } = await req.json();
    if (!message) {
      return NextResponse.json(
        { ok: false, error: "Message query param is required" },
        { status: 400 },
      );
    }

    const encoder = new TextEncoder();

    const sse = (event: string, data: unknown) =>
      encoder.encode(`${event}\ndata: ${JSON.stringify(data)}\n\n`);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of await agent.stream(
            { messages: [{ role: "user", content: message }] },
            { streamMode: "messages" },
          )) {
            const msg = chunk[0];

            if (msg?.type != "ai") continue;
            controller.enqueue(sse("message", { message: msg?.content }));
          }
          setTimeout(() => {
            controller.enqueue(sse("end", { ok: true }));
            controller.close();
          }, 1000);
        } catch (error) {
          console.log("Error agent/streams: ", (error as Error)?.message);
          controller.enqueue(sse("error", { error: (error as Error).message }));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
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
});
