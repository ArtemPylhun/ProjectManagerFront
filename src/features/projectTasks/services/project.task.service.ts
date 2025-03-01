import { HttpClient } from "../../../utils/http/HttpClient";
import {
  ProjectTaskInterface,
  ProjectTaskCreateInterface,
  ProjectTaskUpdateInterface,
} from "../interfaces/ProjectTaskInterface";
import { ProjectTaskStatusInterface } from "../interfaces/ProjectTaskStatusInterface";

export class ProjectTaskService {
  static async getAllProjectTasks(
    signal: AbortSignal
  ): Promise<ProjectTaskInterface[]> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/project-tasks`,
      },
      signal
    );
    return await httpClient.get(`get-all`);
  }

  static async getAllProjectTasksByUserId(
    userId: string,
    signal: AbortSignal
  ): Promise<ProjectTaskInterface[]> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/project-tasks`,
      },
      signal
    );
    return await httpClient.get(`get-all-by-user-id/${userId}`);
  }

  static async getAllProjectTasksPaginated(
    page: number,
    pageSize: number,
    search: string,
    signal: AbortSignal
  ): Promise<{
    items: ProjectTaskInterface[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
  }> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/project-tasks`,
      },
      signal
    );
    let url = `get-all-paginated?page=${page}&pageSize=${pageSize}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    console.warn("ProjectTaskService URL:", url);
    return await httpClient.get(url);
  }

  static async getAllProjectTasksByUserIdPaginated(
    userId: string,
    page: number,
    pageSize: number,
    search: string,
    signal: AbortSignal
  ): Promise<{
    items: ProjectTaskInterface[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
  }> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/project-tasks`,
      },
      signal
    );
    let url = `get-all-by-user-id-paginated/${userId}?page=${page}&pageSize=${pageSize}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`; // Match backend parameter name
    }
    console.warn("ProjectTaskService URL for user:", url);
    return await httpClient.get(url);
  }

  static async getAllTaskStatuses(
    signal: AbortSignal
  ): Promise<ProjectTaskStatusInterface[]> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/project-tasks`,
      },
      signal
    );
    return await httpClient.get("get-project-tasks-statuses");
  }

  static async getProjectTaskById(
    projectTaskId: string,
    signal: AbortSignal
  ): Promise<ProjectTaskInterface> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/project-tasks`,
      },
      signal
    );
    return await httpClient.get(projectTaskId);
  }

  static async createProjectTask(
    projectTask: ProjectTaskCreateInterface,
    signal: AbortSignal
  ): Promise<ProjectTaskInterface> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/project-tasks`,
      },
      signal
    );
    return await httpClient.post("/create", { ...projectTask });
  }

  static async updateProjectTask(
    projectTask: ProjectTaskUpdateInterface,
    signal: AbortSignal
  ): Promise<ProjectTaskInterface> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/project-tasks`,
      },
      signal
    );
    return await httpClient.put("/update", { ...projectTask });
  }

  static async deleteProjectTaskById(id: string, signal: AbortSignal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/project-tasks`,
      },
      signal
    );
    return await httpClient.delete(`/delete/${id}`);
  }
}
