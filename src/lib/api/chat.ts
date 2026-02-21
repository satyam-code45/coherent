import { makeHttpReq } from "../helper/makeHttpReq";

export type ChatMessage = {
  role: "ai" | "user";
  content: string;
  userId: string;
  time?: string;
};

export type ChatHistoryReturnType = { message: ChatMessage[] };

export async function fetchChatHistory(
  userId: string,
): Promise<ChatHistoryReturnType> {
  const data = (await makeHttpReq(
    "GET",
    `agent/chat-history?userId=${userId}`,
  )) as ChatHistoryReturnType;

  return data;
}
