import Chatbox from "@/components/chatbox/Chatbox";
import LeftPanel from "@/components/leftpanel/LeftPanel";
import { RightPanel } from "@/components/rightpanel/RightPanel";

export default function Page() {
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
      <RightPanel children={<Chatbox userId="" />}/>
      </main>
    </div>
  );
}
