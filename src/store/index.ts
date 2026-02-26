import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./chatSlice";
import uiSlice from "./uiSlice";
import projectSlice from "./projectSlice";

export const store = configureStore({
  reducer: {
    chat: chatSlice,
    ui: uiSlice,
    project: projectSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
