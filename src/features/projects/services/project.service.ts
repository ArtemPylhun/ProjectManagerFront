import { HttpClient } from "../../../utils/http/HttpClient";
import {
  ProjectCreateInterface,
  ProjectInterface,
  ProjectUpdateInterface,
} from "../interfaces/ProjectInterface.ts";
import {
  ProjectUserInterface,
  ProjectUserCreateInterface,
} from "../interfaces/ProjectUserInterface";

export class ProjectService {
  static async getAllProjects(
    page: number,
    pageSize: number,
    signal: AbortSignal
  ): Promise<{ projects: ProjectInterface[]; totalCount: number }> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/projects`,
      },
      signal
    );
    return await httpClient.get(`get-all?page=${page}&pageSize=${pageSize}`);
  }

  static async getAllProjectsByUserId(
    userId: string,
    page: number,
    pageSize: number,
    signal: AbortSignal
  ): Promise<{ projects: ProjectInterface[]; totalCount: number }> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/projects`,
      },
      signal
    );
    return await httpClient.get(
      `get-all-by-user-id/${userId}?page=${page}&pageSize=${pageSize}`
    );
  }

  static async getProjectById(
    projectId: string,
    signal: AbortSignal
  ): Promise<ProjectInterface> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/projects`,
      },
      signal
    );
    return await httpClient.get(projectId);
  }

  static async createProject(
    project: ProjectCreateInterface,
    signal: AbortSignal
  ): Promise<ProjectInterface> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/projects`,
      },
      signal
    );
    return await httpClient.post("/create", { ...project });
  }

  static async updateProject(
    project: ProjectUpdateInterface,
    signal: AbortSignal
  ): Promise<ProjectInterface> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/projects`,
      },
      signal
    );
    return await httpClient.put("/update", { ...project });
  }

  static async deleteProjectById(id: string, signal: AbortSignal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/projects`,
      },
      signal
    );
    return await httpClient.delete(`/delete/${id}`);
  }

  static async addUserToProject(
    projectUser: ProjectUserCreateInterface,
    signal: AbortSignal
  ): Promise<ProjectUserInterface> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/projects`,
      },
      signal
    );
    return await httpClient.post(`/add-user-to-project`, { ...projectUser });
  }

  static async removeUserFromProject(
    projectUserId: string,
    signal: AbortSignal
  ): Promise<ProjectUserInterface> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/projects`,
      },
      signal
    );
    return await httpClient.delete(
      `/remove-user-from-project/${projectUserId}`
    );
  }
}
