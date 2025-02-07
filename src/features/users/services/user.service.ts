import { HttpClient } from "../../../utils/http/HttpClient";
import UserInterface from "../interfaces/UserInterface";
import UserLoginInterface from "../interfaces/UserLoginInterface";

export class UserService {
  static async getAllUsers(signal: AbortSignal): Promise<UserInterface[]> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/users`
    },signal);
    return await httpClient.get("get-all-with-roles");
  }

  static async loginUser(user: UserLoginInterface, signal: AbortSignal): Promise<string> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient({
      baseURL: `${apiUrl}/users`,
    }, signal);
    return await httpClient.post("/login", { ...user });
  }
}

//   static async registerUser(user, signal: AbortSignal) {
//     const apiUrl = import.meta.env.VITE_API_BASE_URL;
//     const httpClient = new HttpClient({
//       baseURL: `${apiUrl}/users`,
//       signal,
//     });
//     return await httpClient.post("/create", { ...user });
//   }

//   static async updateUser(user, signal: AbortSignal) {
//     console.warn("user", user);
//     const apiUrl = import.meta.env.VITE_API_BASE_URL;
//     const httpClient = new HttpClient({
//       baseURL: `${apiUrl}/users`,
//       signal,
//     });
//     return await httpClient.put("/update", { ...user });
//   }

//   static async deleteUserById(id: string, signal: AbortSignal) {
//     const apiUrl = import.meta.env.VITE_API_BASE_URL;
//     const httpClient = new HttpClient({
//       baseURL: `${apiUrl}/users`,
//       signal,
//     });
//     return await httpClient.delete(`/delete/${id}`);
//   }
// }
