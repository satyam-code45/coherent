import { withAuth } from "@/lib/mongodb/withAuth";
import { ProjectService } from "@/services/ProjectService";
import { NextResponse } from "next/server";

export const GET = withAuth(async (_session, req: Request) => {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const projectService = ProjectService.getInstance();

  const projects = await projectService.getAllProjects({ search, limit, page });

  return NextResponse.json({ projects });
});

export const POST = withAuth(async (_session, req: Request) => {
  const { name, userId, emoji } = await req.json();

  const projectService = ProjectService.getInstance();
  const project = await projectService.createProject({
    name,
    userId,
    emoji,
  });

  return NextResponse.json({ message: "Project created", project });
});
