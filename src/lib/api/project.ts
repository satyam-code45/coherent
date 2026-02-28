import { makeHttpReq } from "../helper/makeHttpReq";

export type PaginationType = {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
};

export type projectListProps = {
  _id: string;
  name: string;
  userId: string;
  emoji: string;
};

export type ProjectServerData = {
  projects: { projects: projectListProps[]; pagination: PaginationType };
};

export async function getProjects(
  page = 1,
  search: string = "",
  signal?: AbortSignal,
): Promise<ProjectServerData> {
  const data = (await makeHttpReq(
    "GET",
    `projects?page=${page}&search=${encodeURIComponent(search)}`,
    undefined,
    { signal },
  )) as ProjectServerData;

  return data;
}

export async function renameProjectApi(
  id: string,
  name: string,
  emoji?: string,
) {
  return makeHttpReq<{ name: string; emoji?: string }>(
    "PATCH",
    `projects/${id}`,
    {
      name,
      emoji,
    },
  ) as Promise<{ message: string }>;
}

export async function deleteProjectApi(id: string) {
  return makeHttpReq("DELETE", `projects/${id}`) as Promise<{
    message: string;
  }>;
}
