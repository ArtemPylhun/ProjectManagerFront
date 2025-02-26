import { useState, useEffect, useCallback } from "react";
import { useLoading } from "../../../hooks/useLoading";
import { TimeEntryInterface } from "../interfaces/TimeEntryInterface";
import { TimeEntryService } from "../services/time.entry.service";
import { TimeEntryCreateInterface } from "../interfaces/TimeEntryInterface";
import { message } from "antd";
import { TimeEntryUpdateInterface } from "../interfaces/TimeEntryInterface";
import useUserId from "../../../hooks/useUserId";
const useTimeEntries = (isUserPage: boolean) => {
  const [timeEntries, setTimeEntries] = useState<TimeEntryInterface[] | null>(
    null
  );
  const { loading, turnOnLoading, turnOffLoading } = useLoading();

  const { userId } = useUserId();

  const fetchAllTimeEntries = useCallback(
    async (signal: AbortSignal): Promise<boolean> => {
      turnOnLoading();
      try {
        const response = await TimeEntryService.getAllTimeEntries(signal);
        if (Array.isArray(response)) {
          setTimeEntries(response as TimeEntryInterface[]);
          return true;
        } else {
          console.error("Invalid response format", response);
          return false;
        }
      } catch (error) {
        console.error("Error fetching time entries:", error);
        return false;
      } finally {
        turnOffLoading();
      }
    },
    []
  );

  const fetchUserTimeEntries = useCallback(
    async (signal: AbortSignal): Promise<boolean> => {
      if (!userId) {
        console.warn("User ID not available yet, skipping fetch");
        return false;
      }

      turnOnLoading();
      try {
        const response = await TimeEntryService.getAllTimeEntriesByUserId(
          userId,
          signal
        );
        console.warn("Fetching user time entries: ", response);
        if (Array.isArray(response)) {
          setTimeEntries(response as TimeEntryInterface[]);
          return true;
        } else {
          console.error("Invalid response format for time entries", response);
          return false;
        }
      } catch (error) {
        console.error("Error fetching user time entries:", error);
        return false;
      } finally {
        turnOffLoading();
      }
    },
    [userId]
  );

  useEffect(() => {
    const abortController = new AbortController();

    const fetchWhenReady = async () => {
      if (isUserPage && userId) {
        await fetchUserTimeEntries(abortController.signal);
      } else {
        await fetchAllTimeEntries(abortController.signal);
      }
    };

    fetchWhenReady();

    return () => abortController.abort();
  }, [isUserPage, userId, fetchAllTimeEntries, fetchUserTimeEntries]);

  const handleCreateTimeEntry = async (
    newTimeEntry: TimeEntryCreateInterface
  ): Promise<boolean> => {
    try {
      const response = await TimeEntryService.createTimeEntry(
        newTimeEntry,
        new AbortController().signal
      );
      if (!response) throw new Error("Time Entry creation failed");
      setTimeEntries((prevTimeEntry) =>
        prevTimeEntry ? [...prevTimeEntry, response] : [response]
      );
      message.success("Time entry created successfully");
      return true;
    } catch (error) {
      console.error(`Failed to create time entry: ${error}`);
      return false;
    }
  };

  const handleUpdateTimeEntry = async (
    updatedTimeEntry: TimeEntryUpdateInterface
  ): Promise<boolean> => {
    try {
      console.log("Updated Time Entry: ", updatedTimeEntry);
      const response = await TimeEntryService.updateTimeEntry(
        updatedTimeEntry,
        new AbortController().signal
      );
      if (!response) throw new Error("Time Entry update failed");
      setTimeEntries((prevTimeEntry) =>
        prevTimeEntry
          ? prevTimeEntry.map((timeEntry) =>
              timeEntry.id === updatedTimeEntry.id
                ? {
                    ...updatedTimeEntry,
                    user: response.user,
                    project: response.project,
                    projectTask: response.projectTask,
                  }
                : timeEntry
            )
          : []
      );
      message.success("Time entry updated successfully");
      return true;
    } catch (error) {
      console.error(`Failed to update time entry: ${error}`);
      return false;
    }
  };

  const handleDeleteTimeEntry = async (
    timeEntryId: string
  ): Promise<boolean> => {
    try {
      const response = await TimeEntryService.deleteTimeEntryById(
        timeEntryId,
        new AbortController().signal
      );
      if (!response) throw new Error("Time Entry deletion failed");
      setTimeEntries((prevTimeEntry) =>
        prevTimeEntry
          ? prevTimeEntry.filter((timeEntry) => timeEntry.id !== timeEntryId)
          : []
      );
      message.success("Time entry deleted successfully");
      return true;
    } catch (error) {
      console.error(`Failed to delete time entry: ${error}`);
      return false;
    }
  };

  return {
    timeEntries,
    loading,
    handleCreateTimeEntry,
    handleUpdateTimeEntry,
    handleDeleteTimeEntry,
  };
};

export default useTimeEntries;
