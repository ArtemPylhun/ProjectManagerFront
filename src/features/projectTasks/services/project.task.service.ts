import { HttpClient } from "../../../utils/http/HttpClient";
import {
  ProjectTaskInterface,
  ProjectTaskCreateInterface,
  ProjectTaskUpdateInterface,
} from "../interfaces/ProjectTaskInterface";
import { ProjectTaskStatusInterface } from "../interfaces/ProjectTaskStatusInterface";
import {
  UserTaskCreateInterface,
  UserTaskInterface,
} from "../interfaces/UserTaskInterface";
export class ProjectTaskService {
  static async getAllProjectTasks(
    page: number,
    pageSize: number,
    signal: AbortSignal
  ): Promise<{ projectTasks: ProjectTaskInterface[]; totalCount: number }> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/project-tasks`,
      },
      signal
    );
    return await httpClient.get(`get-all?page=${page}&pageSize=${pageSize}`);
  }

  static async getAllProjectTasksByUserId(
    userId: string,
    page: number,
    pageSize: number,
    signal: AbortSignal
  ): Promise<{ projectTasks: ProjectTaskInterface[]; totalCount: number }> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/project-tasks`,
      },
      signal
    );
    return await httpClient.get(
      `get-all-by-user-id/${userId}?page=${page}&pageSize=${pageSize}`
    );
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

  static async addUserToTask(
    userTask: UserTaskCreateInterface,
    signal: AbortSignal
  ): Promise<UserTaskInterface> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/project-tasks`,
      },
      signal
    );
    return await httpClient.post(`/add-user-to-project-task`, {
      ...userTask,
    });
  }

  static async removeUserFromTask(
    userTaskId: string,
    signal: AbortSignal
  ): Promise<UserTaskInterface> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/project-tasks`,
      },
      signal
    );
    return await httpClient.delete(
      `/remove-user-from-project-task/${userTaskId}`
    );
  }
}
