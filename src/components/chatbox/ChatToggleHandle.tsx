"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { openChat } from "@/store/uiSlice";
import { PanelRightOpen } from "lucide-react";

export default function ChatToggleHandle() {
  const dispatch = useDispatch();
  const isChatOpen = useSelector((state: RootState) => state.ui.isChatOpen);

  if (isChatOpen) return null;

  return (
    <button
      onClick={() => dispatch(openChat())}
      className="fixed right-0 top-4 z-50 rounded-1-md border bg-white p-2 shadow-md hover:bg-slate-100 transition-all duration-300 ease-in-out"
      aria-label="Open Chat"
    >
      <PanelRightOpen size={18} />
    </button>
  );
}
