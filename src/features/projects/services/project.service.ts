import { HttpClient } from "../../../utils/http/HttpClient";
import {
  ProjectCreateInterface,
  ProjectInterface,
  ProjectUpdateInterface,
} from "../interfaces/ProjectInterface.ts";

export class ProjectService {
  static async getAllProjects(
    signal: AbortSignal
  ): Promise<ProjectInterface[]> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/projects`,
      },
      signal
    );
    return await httpClient.get("get-all");
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

  static async addUserToProject(id: string, signal: AbortSignal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/projects`,
      },
      signal
    );
    return await httpClient.post(`/add-user-to-project`, {});
  }

  static async removeUserFromProject(id: string, signal: AbortSignal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/projects`,
      },
      signal
    );
    return await httpClient.delete(`/delete/${id}`);
  }
}
