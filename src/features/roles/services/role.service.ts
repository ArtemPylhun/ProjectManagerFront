import { HttpClient } from "../../../utils/http/HttpClient";
import RoleInterface from "../interfaces/RoleInterface";
export class RoleService {
  static async getAllRoles(signal: AbortSignal): Promise<RoleInterface[]> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/roles`
    },signal);
    return await httpClient.get("get-all");
  }
}