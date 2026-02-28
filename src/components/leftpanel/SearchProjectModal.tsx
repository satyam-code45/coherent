"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchProjects,
  setCurrentProject,
  toggleModal,
} from "@/store/projectSlice";
import { BaseModal } from "../general/BaseModal";
import { Search, Plus, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface SearchProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchProjectModal({ open, onClose }: SearchProjectModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((state: RootState) => state.project);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.trim(), 300);

  // Track the latest fetch promise so we can abort stale requests
  const activeRequest = useRef<{ abort: () => void } | null>(null);

  // Fetch projects from server whenever the debounced query changes (or modal opens)
  useEffect(() => {
    if (!open) return;

    // Abort any in-flight request before dispatching a new one
    activeRequest.current?.abort();
    const promise = dispatch(
      fetchProjects({ page: 1, search: debouncedQuery }),
    );
    activeRequest.current = promise;

    return () => {
      activeRequest.current?.abort();
    };
  }, [debouncedQuery, open, dispatch]);

  const filtered = projects?.projects ?? [];

  function handleClose() {
    setQuery("");
    onClose();
  }

  function handleNewProject() {
    dispatch(toggleModal());
    handleClose();
  }

  function handleSelectProject(project: {
    _id: string;
    name: string;
    emoji: string;
  }) {
    dispatch(
      setCurrentProject({
        id: project._id,
        name: project.name,
        emoji: project.emoji,
      }),
    );
    handleClose();
  }

  return (
    <BaseModal
      open={open}
      onOpenChange={(v) => !v && handleClose()}
      width={560}
      height={420}
      background="white"
    >
      {/* Clear button next to the close icon */}
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute top-4 right-12 z-10 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
        >
          Clear
        </button>
      )}

      {/* Search input */}
      <div className="-mt-4 flex items-center gap-2 border-b pb-3">
        <Search size={16} className="shrink-0 text-slate-400" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects..."
          className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
        />
      </div>

      {/* Results */}
      <div className="-mx-2 mt-1 space-y-0.5 overflow-y-auto max-h-70">
        {/* New project action */}
        <button
          onClick={handleNewProject}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-slate-100 transition-colors text-slate-700"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-200 text-slate-600">
            <Plus size={15} />
          </span>
          <span className="font-medium">New project</span>
        </button>

        {/* Divider */}
        {filtered.length > 0 && (
          <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Projects
          </p>
        )}

        {filtered.map((project) => (
          <button
            key={project._id}
            onClick={() => handleSelectProject(project)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-100 transition-colors",
            )}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-base leading-none">
              {project.emoji || (
                <FolderOpen size={15} className="text-slate-500" />
              )}
            </span>
            <span className="truncate text-slate-700">{project.name}</span>
          </button>
        ))}

        {filtered.length === 0 && query.trim() && (
          <p className="py-6 text-center text-sm text-slate-400">
            No projects match &ldquo;{query}&rdquo;
          </p>
        )}
      </div>
    </BaseModal>
  );
}
