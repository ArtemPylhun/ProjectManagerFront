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

  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { loading, turnOnLoading, turnOffLoading } = useLoading();

  const { userId } = useUserId();

  const pageSize = 1;

  const fetchTimeEntries = useCallback(
    async (signal: AbortSignal) => {
      if (!userId) {
        console.error("No userId found in localStorage");
        return;
      }
      turnOnLoading();
      try {
        const response = isUserPage
          ? await TimeEntryService.getAllTimeEntriesByUserId(
              userId,
              currentPage,
              pageSize,
              signal
            )
          : await TimeEntryService.getAllTimeEntries(
              currentPage,
              pageSize,
              signal
            );
        console.warn("Fetching all time entries: ", response);
        if (response.timeEntries) {
          setTimeEntries(response.timeEntries);
          setTotalCount(response.totalCount);
        }
      } catch (error) {
        console.error("Error fetching time entries:", error);
        return false;
      } finally {
        turnOffLoading();
      }
    },
    [userId, isUserPage, currentPage]
  );

  useEffect(() => {
    if (!userId) return;
    const abortController = new AbortController();
    fetchTimeEntries(abortController.signal);
    return () => abortController.abort();
  }, [fetchTimeEntries, userId, currentPage, totalCount]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
      setTotalCount((prevCount) => prevCount + 1);

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
      setTimeEntries((prevTimeEntry) => {
        const updatedTimeEntries = prevTimeEntry
          ? prevTimeEntry.filter((timeEntry) => timeEntry.id !== timeEntryId)
          : [];

        if (updatedTimeEntries.length === 0 && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        }
        return updatedTimeEntries;
      });
      setTotalCount((prevCount) => prevCount - 1);
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
    currentPage,
    totalCount,
    pageSize,
    handlePageChange,
  };
};

export default useTimeEntries;
