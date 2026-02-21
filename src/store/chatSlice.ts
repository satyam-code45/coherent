import { ChatMessage, fetchChatHistory } from "@/lib/api/chat";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

type ChatState = {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
};

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

export const getChatHistory = createAsyncThunk<
  ChatMessage[],
  string,
  { rejectValue: string }
>("chat/getHistory", async (userId, { rejectWithValue }) => {
  try {
    const res = await fetchChatHistory(userId);
    return res.message;
  } catch (error) {
    console.log("Error in the chatSlice store: ", error);

    return rejectWithValue("Failed to load chat History!");
  }
});

const chatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    clearChat(state) {
      state.messages = [];
    },

    addUserAndAiPlaceholder(
      state,
      action: PayloadAction<{ userId: string; content: string }>,
    ) {
      state.messages.push(
        {
          role: "user",
          content: action.payload.content,
          userId: action.payload.userId,
        },
        {
          role: "ai",
          content: "",
          userId: action.payload.userId,
        },
      );
    },

    appendToLastAiMessage(state, action: PayloadAction<string>) {
      const last = state.messages[state.messages.length - 1];
      if (last?.role === "ai") {
        last.content += action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload ?? [];
      })
      .addCase(getChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { clearChat, addUserAndAiPlaceholder, appendToLastAiMessage } =
  chatSlice.actions;

export default chatSlice.reducer;
