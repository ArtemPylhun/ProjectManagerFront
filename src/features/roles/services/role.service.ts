import { HttpClient } from "../../../utils/http/HttpClient";
import {
  RoleInterface,
  RoleCreateInterface,
} from "../interfaces/RoleInterface";
import { RoleGroupInterface } from "../interfaces/RoleGroupIntreface";
export class RoleService {
  static async getProjectRoles(signal: AbortSignal): Promise<RoleInterface[]> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/roles`,
      },
      signal
    );
    return await httpClient.get("get-project-roles");
  }
  static async getAllRoles(signal: AbortSignal): Promise<RoleInterface[]> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/roles`,
      },
      signal
    );
    return await httpClient.get("get-all");
  }

  static async getRoleGroups(
    signal: AbortSignal
  ): Promise<RoleGroupInterface[]> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/roles`,
      },
      signal
    );
    return await httpClient.get("get-role-groups");
  }

  static async createRole(
    role: RoleCreateInterface,
    signal: AbortSignal
  ): Promise<RoleInterface> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/roles`,
      },
      signal
    );
    return await httpClient.post("/create", { ...role });
  }

  static async updateRole(
    role: RoleInterface,
    signal: AbortSignal
  ): Promise<RoleInterface> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/roles`,
      },
      signal
    );
    return await httpClient.put("/update", { ...role });
  }

  static async deleteRoleById(id: string, signal: AbortSignal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/roles`,
      },
      signal
    );
    return await httpClient.delete(`/delete/${id}`);
  }
}
