import { HttpClient } from "../../../utils/http/HttpClient";
import {
  TimeEntryCreateInterface,
  TimeEntryInterface,
  TimeEntryUpdateInterface,
} from "../interfaces/TimeEntryInterface";
export class TimeEntryService {
  static async getAllTimeEntries(
    signal: AbortSignal
  ): Promise<TimeEntryInterface[]> {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const httpClient = new HttpClient(
      {
        baseURL: `${apiUrl}/time-entries`,
      },
      signal
    );
    return await httpClient.get("get-all");
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
