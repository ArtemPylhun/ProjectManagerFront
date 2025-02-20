import { HttpClient } from "../../../utils/http/HttpClient";
import {
  UserInterface,
  UserLoginInterface,
  UserRegisterInterface,
} from "../interfaces/UserInterface";

export class UserService {
  static async getAllUsers(signal: AbortSignal): Promise<UserInterface[]> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/users`,
      },
      signal
    );
    return await httpClient.get("get-all-with-roles");
  }

  static async getUserWithRolesById(
    userId: string,
    signal: AbortSignal
  ): Promise<UserInterface> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/users`,
      },
      signal
    );
    return await httpClient.get(`/${userId}`);
  }

  static async loginUser(
    user: UserLoginInterface,
    signal: AbortSignal
  ): Promise<string> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/users`,
      },
      signal
    );
    return await httpClient.post("/login", { ...user });
  }

  static async registerUser(
    user: UserRegisterInterface,
    signal: AbortSignal
  ): Promise<any> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/users`,
      },
      signal
    );
    return await httpClient.post("/create", { ...user });
  }

  static async updateRoles(
    userId: string,
    roles: string[],
    signal: AbortSignal
  ): Promise<UserInterface> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/users`,
      },
      signal
    );
    return await httpClient.put(`/${userId}/update-roles`, roles);
  }

  static async deleteUserById(id: string, signal: AbortSignal) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/users`,
      },
      signal
    );
    return await httpClient.delete(`/delete/${id}`);
  }

  static async updateUser(
    user: UserInterface,
    signal: AbortSignal
  ): Promise<UserInterface> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/users`,
      },
      signal
    );
    return await httpClient.put("/update", { ...user });
  }
}
