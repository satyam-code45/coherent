import {
  getProjects,
  renameProjectApi,
  deleteProjectApi,
  PaginationType,
  ProjectServerData,
} from "@/lib/api/project";
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (
    { page = 1, search = "" }: { page: number; search: string },
    { signal },
  ) => getProjects(page, search, signal),
);

export const renameProject = createAsyncThunk(
  "projects/renameProject",
  async ({ id, name, emoji }: { id: string; name: string; emoji?: string }) => {
    await renameProjectApi(id, name, emoji);
    return { id, name, emoji };
  },
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id: string) => {
    await deleteProjectApi(id);
    return id;
  },
);

interface ProjectState extends ProjectServerData {
  loading: boolean;
  error: string | null;
  modal: boolean;
  currentProject?: {
    id?: string;
    name?: string;
    emoji?: string;
    edit?: boolean;
  } | null;
}

const initialState: ProjectState = {
  projects: { projects: [], pagination: {} as PaginationType },
  loading: false,
  error: null,
  modal: false,
};

const projectSlice = createSlice({
  name: "projectSlice",
  initialState: {
    ...initialState,
  },
  reducers: {
    toggleModal: (state) => {
      state.modal = !state.modal;
      state.currentProject = { edit: false };
    },

    setCurrentProject: (
      state,
      action: PayloadAction<{ id: string; name: string; emoji?: string }>,
    ) => {
      state.currentProject = { ...action.payload, edit: true };
      state.modal = true;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<ProjectServerData>) => {
          state.projects = action.payload?.projects;
          state.projects.pagination = action.payload?.projects?.pagination;
          state.loading = false;
        },
      )
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch Projects";
      })
      .addCase(
        renameProject.fulfilled,
        (
          state,
          action: PayloadAction<{ id: string; name: string; emoji?: string }>,
        ) => {
          const project = state.projects.projects.find(
            (p) => p._id === action.payload.id,
          );
          if (project) {
            project.name = action.payload.name;
            if (action.payload.emoji) project.emoji = action.payload.emoji;
          }
        },
      )
      .addCase(
        deleteProject.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.projects.projects = state.projects.projects.filter(
            (p) => p._id !== action.payload,
          );
        },
      );
  },
});

export const { toggleModal, setCurrentProject } = projectSlice.actions;

export default projectSlice.reducer;
