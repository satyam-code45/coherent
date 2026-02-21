import { withErrorHandler } from "@/lib/mongodb/withErrorHandler";
import { ChatCerebras } from "@langchain/cerebras";
import { createAgent } from "langchain";
import { NextResponse } from "next/server";
import { writeToChatHistoryTool } from "@/lib/tools/ChatHistoryTools";

export const POST = withErrorHandler(async (req: Request) => {
  try {
    const { message, userId } = await req.json();

    if (!message) {
      return NextResponse.json(
        { ok: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const model = new ChatCerebras({
      model: "llama-3.1-8b",
      temperature: 0,
      maxTokens: undefined,
      apiKey: process.env.CEREBRAS_API_KEY,
    });

    const agent = createAgent({
      model,
    });

    // Save user message immediately
    await writeToChatHistoryTool.invoke({
      messages: [{ role: "user", content: message, userId }],
    });

    const encoder = new TextEncoder();

    const sse = (event: string, data: unknown) =>
      encoder.encode(`${event}\ndata: ${JSON.stringify(data)}\n\n`);

    let streamingText = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const agentStream = await agent.stream(
            { messages: [{ role: "user", content: message }] },
            { streamMode: "messages" }
          );

          for await (const chunk of agentStream) {
            const msg = chunk[0];

            if (msg?.type !== "ai") continue;

            streamingText += msg.content ?? "";

            controller.enqueue(
              sse("message", { message: msg.content })
            );
          }

          // Save final AI message AFTER streaming completes
          if (streamingText.trim().length > 0) {
            await writeToChatHistoryTool.invoke({
              messages: [{ role: "ai", content: streamingText, userId }],
            });
          }

          controller.enqueue(sse("end", { ok: true }));
          controller.close();

        } catch (error) {
          console.error("Streaming error:", (error as Error)?.message);

          controller.enqueue(
            sse("error", { error: (error as Error).message })
          );

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
    const message =
      err instanceof Error ? err.message : "Internal Server Error";

    return new Response(
      JSON.stringify({ ok: false, error: message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});