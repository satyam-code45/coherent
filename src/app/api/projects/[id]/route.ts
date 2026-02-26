import { withAuth } from "@/lib/mongodb/withAuth";
import { ProjectService } from "@/services/ProjectService";
import { NextResponse } from "next/server";

export const PATCH = withAuth(
  async (
    _session,
    req: Request,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const { name, emoji } = await req.json();
    const projectService = ProjectService.getInstance();
    const updated = await projectService.updateProjects({ id, name, emoji });
    return NextResponse.json({ message: "Project updated", project: updated });
  },
);

export const DELETE = withAuth(
  async (
    _session,
    _req: Request,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const projectService = ProjectService.getInstance();
    await projectService.deleteProject(id);
    return NextResponse.json({ message: "Project deleted" });
  },
);
