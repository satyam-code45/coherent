"use client"
import Chatbox from "@/components/chatbox/Chatbox";
import LeftPanel from "@/components/leftpanel/LeftPanel";
import { RightPanel } from "@/components/rightpanel/RightPanel";
import { useSession } from "next-auth/react";

export default function Page() {
  const {data: session} = useSession();
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
      <RightPanel children={<Chatbox userId={session?.user?.id} />}/>
      </main>
    </div>
  );
}
