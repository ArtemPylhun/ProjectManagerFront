import { HttpClient } from "../../../utils/http/HttpClient";
import {
  TimeEntryCreateInterface,
  TimeEntryInterface,
  TimeEntryUpdateInterface,
} from "../interfaces/TimeEntryInterface";
export class TimeEntryService {
  static async getAllTimeEntriesPaginated(
    page: number,
    pageSize: number,
    search: string,
    signal: AbortSignal
  ): Promise<{
    items: TimeEntryInterface[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
  }> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/time-entries`,
      },
      signal
    );
    let url = `get-all?page=${page}&pageSize=${pageSize}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return await httpClient.get(url);
  }

  static async getAllTimeEntriesByUserIdPaginated(
    userId: string,
    page: number,
    pageSize: number,
    search: string,
    signal: AbortSignal
  ): Promise<{
    items: TimeEntryInterface[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
  }> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/time-entries`,
      },
      signal
    );
    let url = `get-all-by-user-id/${userId}?page=${page}&pageSize=${pageSize}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return await httpClient.get(url);
  }

  static async createTimeEntry(
    timeEntry: TimeEntryCreateInterface,
    signal: AbortSignal
  ): Promise<TimeEntryInterface> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/time-entries`,
      },
      signal
    );
    return await httpClient.post("/create", { ...timeEntry });
  }

  static async updateTimeEntry(
    timeEntry: TimeEntryUpdateInterface,
    signal: AbortSignal
  ): Promise<TimeEntryInterface> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/time-entries`,
      },
      signal
    );
    return await httpClient.put(`/update`, { ...timeEntry });
  }

  static async deleteTimeEntryById(
    id: string,
    signal: AbortSignal
  ): Promise<TimeEntryInterface> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/time-entries`,
      },
      signal
    );
    return await httpClient.delete(`/delete/${id}`);
  }
}
