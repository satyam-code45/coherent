import fs from "fs";
import path from "path";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const ROOT = process.cwd();
const CHAT_HISTORY_DIR = path.join(ROOT, "public", "chat-history");

if (!fs.existsSync(CHAT_HISTORY_DIR)) {
  fs.mkdirSync(CHAT_HISTORY_DIR, { recursive: true });
}

const HISTORY_FILE = path.join(CHAT_HISTORY_DIR, "chat-history.json");

export const messageSchema = z.object({
  role: z.enum(["user", "ai"]),
  userId: z.string(),
  content: z.string(),
});

export const writeToChatHistoryTool = tool(
  async ({ messages }) => {
    try {
      let history: any[] = [];

      //load old history if exists
      if (fs.existsSync(HISTORY_FILE)) {
        const data = fs.readFileSync(HISTORY_FILE, "utf-8");
        history = JSON.parse(data);
      }

      //add new message
      history.push(...messages);

      fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), "utf-8");
      return "Chat History written successfully!";
    } catch (error) {
      console.log("Error in write to chat-history tool: ", error);
      return "Failed to write chat history.";
    }
  },
  {
    name: "write_memory",
    description: "Wrtie conversation to chat-history",
    schema: z.object({
      messages: z.array(messageSchema),
    }),
  },
);

export const readChatHistoryTool = tool(
  async ({ userId }) => {
    try {
      if (!fs.existsSync(HISTORY_FILE)) {
        return "[]";
      }

      //Read memory file
      const data = fs.readFileSync(HISTORY_FILE, "utf-8");
      const history = JSON.parse(data);

      //filter
      const filtered = history.filter((item: any) => {
        if (userId) {
          return item.userId === userId;
        }
        return item.userId === userId;
      });

      return JSON.stringify(filtered);
    } catch (error) {
      console.log("Error in readChatHistoryTool: ", error);
      return "[]";
    }
  },
  {
    name: "read_memory",
    description: "Retrive chat history entries for a given user",
    schema: z.object({
      userId: z.string(),
      projectId: z.string().optional(),
    }),
  },
);
