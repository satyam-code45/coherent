"use client";
import { projectListProps } from "@/lib/api/project";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ProjectSection({
  projects = [],
  onAdd,
  onEdit,
  onDelete,
}: {
  projects?: projectListProps[];
  onAdd?: () => void;
  onEdit?: (project: projectListProps) => void;
  onDelete?: (id: string) => void;
}) {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col h-full px-2">
      {/* Header */}
      <div className="mb-1 flex items-center justify-between px-2 py-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Projects
        </span>
        <button
          onClick={onAdd}
          className="cursor-pointer rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          title="New project"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 space-y-0.5 overflow-y-auto">
        {projects.length === 0 && (
          <p className="px-2 py-3 text-xs text-slate-400 text-center">
            No projects yet
          </p>
        )}
        {projects.map((project) => (
          <div
            key={project._id}
            className="group relative flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {/* Emoji */}
            <span className="text-base leading-none shrink-0">
              {project.emoji || "📁"}
            </span>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <span className="block truncate text-sm text-slate-700">
                {project.name}
              </span>
            </div>

            {/* Three-dot menu button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpenId(menuOpenId === project._id ? null : project._id);
              }}
              className={cn(
                "shrink-0 rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors",
                "opacity-0 group-hover:opacity-100",
                menuOpenId === project._id && "opacity-100",
              )}
            >
              <MoreHorizontal size={14} />
            </button>

            {/* Dropdown menu */}
            {menuOpenId === project._id && (
              <div
                ref={menuRef}
                className="absolute right-2 top-8 z-50 min-w-32.5 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
              >
                <button
                  onClick={() => {
                    onEdit?.(project);
                    setMenuOpenId(null);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100"
                >
                  <Pencil size={12} />
                  Rename
                </button>
                <button
                  onClick={() => {
                    onDelete?.(project._id);
                    setMenuOpenId(null);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
