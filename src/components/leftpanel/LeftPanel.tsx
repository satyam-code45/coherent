"use client";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  FileText,
  Library,
  MessageSquare,
  Plus,
  Search,
} from "lucide-react";
// ------------------ TYPES ------------------

import { useState } from "react";
import { Input } from "../ui/input";

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
  const [activeSection, setActiveSession] = useState<"document" | "library">(
    "library",
  );

  const [menuOpen, setMenuOpen] = useState(true);
  const [contentOpen, setContentOpen] = useState(true);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const hasSelection = selectedIds.size > 0;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(librarySources.map((s) => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  return (
    <div className="relative flex h-full overflow-hidden">
      {/* Panel1 - MENU */}
      <aside
        className={cn(
          "flex flex-col border-r bg-slate-50 transition-all",
          menuOpen ? "w-56" : "w-0",
        )}
      >
        <div className={cn("flex h-full flex-col", !menuOpen && "hidden")}>
          <div className="flex items-center justify-between border-b px-4 py-4">
            <span className="text-sm font-semibold">Satyam</span>
            <button onClick={() => setMenuOpen(false)}>
              <ChevronLeft size={16} />
            </button>
          </div>

          <nav className="space-y-1 px-2 py-3 text-sm">
            <MenuItem icon={<Plus size={16} />} label="New" />
            <MenuItem
              icon={<FileText size={16} />}
              label="Documents"
              active={activeSection === "document"}
              onClick={() => setActiveSession("document")}
            />
            <MenuItem
              icon={<Library size={16} />}
              label="Library"
              active={activeSection === "library"}
              onClick={() => setActiveSession("library")}
            />
            <MenuItem icon={<MessageSquare size={16} />} label="AI Chat" />
          </nav>
        </div>
        <div className="flex mt-auto px-4 py-3 border-t items-center">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-50">
            Satyam
          </p>
        </div>
      </aside>

      {/* PANEL - 2 : CONTENT */}
      <aside
        className={cn(
          "flex flex-col border-r bg-white transition-all",
          contentOpen ? "w-96" : "w-0",
        )}
      >
        <div className={cn("flex h-full flex-col", !contentOpen && "hidden")}>
          {/* Header */}
          <div className="flex items-center justify-between boder-b px-4 py-4">
            <span className="text-sm font-semibold capitalize">
              {activeSection}
            </span>
            <button onClick={() => setContentOpen(false)}>
              <ChevronLeft size={16} />
            </button>
          </div>

          {/* Search */}
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 "></Search>
              <Input
                placeholder="Search Sources..."
                className="pl-9 ring-0"
              ></Input>
            </div>
          </div>

          {activeSection === "document" && (
            <div className="flex-1 overflow-y-auto px-3">
              {documents.map((item) => (
                <div
                  key={item}
                  className="cursor-pointer rounded-md px-3 py-2 text-sm"
                >
                  <p className="font-medium">{item}</p>
                  <p className="text-xs text-slate-500">
                    Februray 19 . Opened 2 days ago
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
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
        "flex w-full items-center gap-2 rounded-md px-3 py-2",
        active ? "bg-slate-200 font-medium" : "hover:bg-slate-200",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
