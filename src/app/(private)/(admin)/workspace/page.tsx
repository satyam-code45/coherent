"use client";
import Chatbox from "@/components/chatbox/Chatbox";
import ChatToggleHandle from "@/components/chatbox/ChatToggleHandle";
import LeftPanel from "@/components/leftpanel/LeftPanel";
import { RightPanel } from "@/components/rightpanel/RightPanel";
import { RootState } from "@/store";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";

export default function Page() {
  const { data: session } = useSession();
  const { isChatOpen } = useSelector((state: RootState) => state.ui);
  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900">
      {/* Left SideBar */}
      <LeftPanel />

      {/* Main Area */}
      <main className="flex flex-1 overflow-hidden">
        {/* PDF Area */}
        <section className="flex flex-1 flex-col border-r bg-white">
          {/*<MiddlePanel fileUrl=""  */}
        </section>
        {/*Chat Panel (resizable) */}
        <ChatToggleHandle />
        {isChatOpen && (
          <RightPanel
            children={<Chatbox userId={session?.user?.id as string} />}
          />
        )}
      </main>
    </div>
  );
}
