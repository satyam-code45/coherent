"use client";
import { cn } from "@/lib/utils";
import { showError, showSuccess } from "@/lib/utils";
import {
  ChevronLeft,
  FileText,
  Library,
  MessageSquare,
  PanelLeft,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
// ------------------ TYPES ------------------

import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchProjects,
  toggleModal,
  deleteProject,
  setCurrentProject,
} from "@/store/projectSlice";
import { ProjectModal } from "../project/ProjectModal";
import { ProjectSection } from "./ProjectSeciton";
import { SearchProjectModal } from "./SearchProjectModal";

export type SourceType = "Article" | "Document";

export interface LibrarySource {
  id: string;
  type: SourceType;
  title: string;
  authors: string;
  venue: string;
  if: number | null;
  openAccess: boolean;
}

// ------------------ MOCK DATA ------------------

export const documents: string[] = ["Prompt Engineering"];

export const librarySources: LibrarySource[] = [
  {
    id: "a1",
    type: "Article",
    title:
      "Verbalized Sampling: How to Mitigate Mode Collapse and Unlock LLM Diversity",
    authors: "Zhang, Yu, Chong, Sicilia, Tomz, Manning, Shi",
    venue: "arXiv (Cornell University), 2025",
    if: 0.53,
    openAccess: true,
  },
  {
    id: "d1",
    type: "Document",
    title: "Prompt Engineering",
    authors: "Weng",
    venue: "2023",
    if: null,
    openAccess: false,
  },
];

export default function LeftPanel() {
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((state: RootState) => state.project);

  const [activeSection, setActiveSection] = useState<"document" | "library">(
    "library",
  );
  const [menuOpen, setMenuOpen] = useState(true);
  const [contentOpen, setContentOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects({ page: 1, search: "" }));
  }, [dispatch]);

  /**
   * Toggle logic for content section icons:
   * - If content panel is closed → open it and set section
   * - If content panel is open and same section → close it
   * - If content panel is open and different section → switch section
   */
  function handleSectionClick(section: "document" | "library") {
    if (!contentOpen) {
      setContentOpen(true);
      setActiveSection(section);
    } else if (activeSection === section) {
      setContentOpen(false);
    } else {
      setActiveSection(section);
    }
  }

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "SA";

  return (
    <div className="relative flex h-full overflow-hidden">
      {/* ── ICON SIDEBAR (shown only when menu panel is collapsed) ── */}
      {!menuOpen && (
        <nav className="flex w-12 shrink-0 flex-col items-center border-r bg-slate-50 py-3 gap-1">
          {/* Brand / logo — hover to reveal open-sidebar icon */}
          <button
            onClick={() => setMenuOpen(true)}
            title="Open sidebar"
            className="group mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors"
          >
            <Sparkles size={16} className="text-slate-600 group-hover:hidden" />
            <PanelLeft
              size={16}
              className="text-slate-600 hidden group-hover:block"
            />
          </button>

          <div className="my-1 w-6 border-t border-slate-200" />

          {/* Toggle menu panel */}
          <SidebarIcon icon={<Plus size={18} />} tooltip="New" active={false} />

          {/* Documents */}
          <SidebarIcon
            icon={<FileText size={18} />}
            tooltip="Documents"
            onClick={() => handleSectionClick("document")}
            active={contentOpen && activeSection === "document"}
          />

          {/* Library */}
          <SidebarIcon
            icon={<Library size={18} />}
            tooltip="Library"
            onClick={() => handleSectionClick("library")}
            active={contentOpen && activeSection === "library"}
          />

          {/* AI Chat */}
          <SidebarIcon
            icon={<MessageSquare size={18} />}
            tooltip="AI Chat"
            active={false}
          />

          {/* Spacer */}
          <div className="flex-1" />

          {/* User avatar */}
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-400 transition-colors"
            title={session?.user?.name ?? "User"}
          >
            {userInitials}
          </button>
        </nav>
      )}

      {/* ── PANEL 1 : MENU ───────────────────────────────────── */}
      <aside
        className={cn(
          "flex flex-col border-r bg-slate-50 transition-all duration-200 overflow-hidden",
          menuOpen ? "w-52" : "w-0",
        )}
      >
        <div
          className={cn(
            "flex h-full flex-col min-w-52 transition-opacity duration-200",
            !menuOpen && "opacity-0 pointer-events-none",
          )}
        >
          <div className="flex items-center justify-between border-b px-4 py-4">
            <span className="text-sm font-semibold">
              {session?.user?.name ?? "Satyam"}
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="rounded p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          <nav className="space-y-1 px-2 py-3 text-sm">
            <MenuItem icon={<Plus size={16} />} label="New" />
            <MenuItem
              icon={<Search size={16} />}
              label="Search projects"
              onClick={() => setSearchOpen(true)}
            />
            <MenuItem
              icon={<FileText size={16} />}
              label="Documents"
              active={contentOpen && activeSection === "document"}
              onClick={() => handleSectionClick("document")}
            />
            <MenuItem
              icon={<Library size={16} />}
              label="Library"
              active={contentOpen && activeSection === "library"}
              onClick={() => handleSectionClick("library")}
            />
            <MenuItem icon={<MessageSquare size={16} />} label="AI Chat" />
          </nav>

          <ProjectModal session={session} />

          {/* Projects */}
          <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
            <ProjectSection
              projects={projects?.projects}
              onAdd={() => dispatch(toggleModal())}
              onEdit={(project) =>
                dispatch(
                  setCurrentProject({
                    id: project._id,
                    name: project.name,
                    emoji: project.emoji,
                  }),
                )
              }
              onDelete={async (id) => {
                try {
                  await dispatch(deleteProject(id)).unwrap();
                  showSuccess("Project deleted");
                } catch {
                  showError("Failed to delete project");
                }
              }}
            />
          </div>

          <div className="flex mt-auto px-4 py-3 border-t items-center">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-50 truncate">
              {session?.user?.name ?? "Satyam"}
            </p>
          </div>
        </div>
      </aside>

      {/* ── PANEL 2 : CONTENT ────────────────────────────────── */}
      <aside
        className={cn(
          "flex flex-col border-r bg-white transition-all duration-200 overflow-hidden",
          contentOpen ? "w-80" : "w-0",
        )}
      >
        <div
          className={cn(
            "flex h-full flex-col min-w-80 transition-opacity duration-200",
            !contentOpen && "opacity-0 pointer-events-none",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-4">
            <span className="text-sm font-semibold capitalize">
              {activeSection}
            </span>
            <button
              onClick={() => setContentOpen(false)}
              className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors text-base leading-none"
              title="Close panel"
            >
              &times;
            </button>
          </div>

          {/* Search */}
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search Sources..." className="pl-9 ring-0" />
            </div>
          </div>

          {activeSection === "document" && (
            <div className="flex-1 overflow-y-auto px-3">
              {documents.map((item) => (
                <div
                  key={item}
                  className="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-slate-50"
                >
                  <p className="font-medium">{item}</p>
                  <p className="text-xs text-slate-500">
                    February 19 · Opened 2 days ago
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeSection === "library" && (
            <div className="flex-1 overflow-y-auto px-3">
              {librarySources.map((source) => (
                <div
                  key={source.id}
                  className="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-slate-50 border-b last:border-0"
                >
                  <p className="font-medium text-xs text-slate-400 uppercase tracking-wide mb-0.5">
                    {source.type}
                  </p>
                  <p className="font-medium leading-tight">{source.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {source.authors}
                  </p>
                  <p className="text-xs text-slate-400">{source.venue}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      <SearchProjectModal
        key={String(searchOpen)}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}

// ------------------ SUB-COMPONENTS ------------------

function SidebarIcon({
  icon,
  tooltip,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={cn(
        "group relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
        active
          ? "bg-slate-200 text-slate-900"
          : "text-slate-500 hover:bg-slate-200 hover:text-slate-800",
      )}
    >
      {icon}
      {/* Tooltip */}
      <span className="pointer-events-none absolute left-full ml-2 z-50 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {tooltip}
      </span>
    </button>
  );
}

function MenuItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors",
        active
          ? "bg-slate-200 font-medium text-slate-900"
          : "text-slate-700 hover:bg-slate-100",
      )}
    >
      <span className="text-slate-500">{icon}</span>
      {label}
    </button>
  );
}
