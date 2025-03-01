import { useState, useCallback, useEffect } from "react";
import {
  ProjectTaskInterface,
  ProjectTaskCreateInterface,
  ProjectTaskUpdateInterface,
} from "../interfaces/ProjectTaskInterface";
import { ProjectTaskService } from "../services/project.task.service";
import { useLoading } from "../../../hooks/useLoading";
import { message } from "antd";
import { ProjectTaskStatusInterface } from "../interfaces/ProjectTaskStatusInterface";
import useUserId from "../../../hooks/useUserId";

const useProjectTasks = (isPaginated: boolean) => {
  const [projectTasks, setProjectTasks] = useState<
    ProjectTaskInterface[] | null
  >(null);
  const [projectTaskStatuses, setProjectTaskStatuses] = useState<
    ProjectTaskStatusInterface[] | null
  >(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(5);
  const { loading, turnOnLoading, turnOffLoading } = useLoading();
  const { userId, isAdmin } = useUserId();

  const fetchAllProjectTasks = useCallback(
    async (
      signal: AbortSignal,
      search: string = "",
      userId: string,
      isAdmin: boolean
    ): Promise<void> => {
      turnOnLoading();
      try {
        if (isPaginated) {
          const response = isAdmin
            ? await ProjectTaskService.getAllProjectTasksPaginated(
                currentPage,
                pageSize,
                search,
                signal
              )
            : await ProjectTaskService.getAllProjectTasksByUserIdPaginated(
                userId!,
                currentPage,
                pageSize,
                search,
                signal
              );
          setProjectTasks(response.items);
          setTotalCount(response.totalCount);
          setCurrentPage(response.currentPage);
          setPageSize(response.pageSize);
        } else {
          const response = isAdmin
            ? await ProjectTaskService.getAllProjectTasks(signal)
            : await ProjectTaskService.getAllProjectTasksByUserId(
                userId!,
                signal
              );
          setProjectTasks(response ?? []);
        }
      } catch (error) {
        console.error("Error fetching project tasks:", error);
        setProjectTasks([]);
      } finally {
        turnOffLoading();
      }
    },
    [isPaginated, currentPage, pageSize]
  );

  const fetchProjectTaskStatuses = useCallback(
    async (signal: AbortSignal): Promise<boolean> => {
      turnOnLoading();
      try {
        const response = await ProjectTaskService.getAllTaskStatuses(signal);
        if (Array.isArray(response)) {
          setProjectTaskStatuses(response);
          return true;
        } else {
          console.error("Invalid response format", response);
          return false;
        }
      } catch (error) {
        console.error("Error fetching project task statuses:", error);
        return false;
      } finally {
        turnOffLoading();
      }
    },
    []
  );

  useEffect(() => {
    if (!userId && !isAdmin) return;
    const abortController = new AbortController();
    fetchAllProjectTasks(
      abortController.signal,
      searchQuery,
      userId || "",
      isAdmin
    );
    fetchProjectTaskStatuses(abortController.signal);
    return () => abortController.abort();
  }, [
    fetchAllProjectTasks,
    fetchProjectTaskStatuses,
    userId,
    isAdmin,
    searchQuery,
  ]);

  const handlePageChange = useCallback(
    (page: number, newPageSize?: number) => {
      if (isPaginated) {
        setCurrentPage(page);
        if (newPageSize) setPageSize(newPageSize);
        const abortController = new AbortController();
        fetchAllProjectTasks(
          abortController.signal,
          searchQuery,
          userId || "",
          isAdmin
        );
        abortController.abort();
      }
    },
    [isPaginated, fetchAllProjectTasks]
  );

  const handleSearch = useCallback(
    (newSearchQuery: string) => {
      const query = newSearchQuery;
      setSearchQuery(query);
      if (isPaginated) {
        setCurrentPage(1);
        const abortController = new AbortController();
        fetchAllProjectTasks(
          abortController.signal,
          query,
          userId || "",
          isAdmin
        );
        abortController.abort();
      } else {
        const abortController = new AbortController();
        fetchAllProjectTasks(
          abortController.signal,
          query,
          userId || "",
          isAdmin
        );
        abortController.abort();
      }
    },
    [isPaginated, fetchAllProjectTasks]
  );

  const fetchProjectTaskById = useCallback(
    async (
      projectTaskId: string,
      signal: AbortSignal
    ): Promise<ProjectTaskInterface | null> => {
      try {
        const response = await ProjectTaskService.getProjectTaskById(
          projectTaskId,
          signal
        );
        return response;
      } catch (error) {
        console.error(`Failed to fetch project task by ID: ${error}`);
        return null;
      }
    },
    []
  );

  const handleCreateProjectTask = async (
    newProjectTask: ProjectTaskCreateInterface
  ): Promise<boolean> => {
    try {
      console.log("NewProjectTask: ", newProjectTask);
      const createdProject = await ProjectTaskService.createProjectTask(
        newProjectTask,
        new AbortController().signal
      );
      if (!createdProject) throw new Error("Project task creation failed");
      setProjectTasks((prevProjects) =>
        prevProjects ? [...prevProjects, createdProject] : [createdProject]
      );
      setTotalCount((prevCount) => prevCount + 1);
      message.success("Project task created successfully");
      return true;
    } catch (error) {
      console.error(`Failed to create project task: ${error}`);
      return false;
    }
  };

  const handleUpdateProjectTask = async (
    updatedProjectTask: ProjectTaskUpdateInterface
  ): Promise<boolean> => {
    try {
      console.warn("UpdatedProjectTask: ", updatedProjectTask);
      const response = await ProjectTaskService.updateProjectTask(
        updatedProjectTask,
        new AbortController().signal
      );
      if (!response) throw new Error("Project task update failed");

      setProjectTasks((prevProjectTasks) =>
        prevProjectTasks
          ? prevProjectTasks.map((projectTask) =>
              projectTask.id === updatedProjectTask.id
                ? {
                    ...updatedProjectTask,
                    project: response.project,
                    createdAt: response.createdAt,
                    creator: response.creator,
                  }
                : projectTask
            )
          : []
      );
      message.success("Project task updated successfully");
      return true;
    } catch (error) {
      console.error(`Failed to update project task: ${error}`);
      return false;
    }
  };

  const handleDeleteProjectTask = async (
    projectTaskId: string
  ): Promise<boolean> => {
    try {
      const response = await ProjectTaskService.deleteProjectTaskById(
        projectTaskId,
        new AbortController().signal
      );
      if (!response) throw new Error("Project deletion failed");
      setProjectTasks((prevProjectTasks) => {
        const updatedProjectTasks = prevProjectTasks
          ? prevProjectTasks.filter(
              (projectTask) => projectTask.id !== projectTaskId
            )
          : [];

        if (updatedProjectTasks.length === 0 && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        }
        return updatedProjectTasks;
      });
      setTotalCount((prevCount) => prevCount - 1);
      message.success("Project task deleted successfully");
      return true;
    } catch (error) {
      console.error(`Failed to delete project task: ${error}`);
      return false;
    }
  };

  return {
    projectTasks,
    projectTaskStatuses,
    loading,
    handleCreateProjectTask,
    handleUpdateProjectTask,
    handleDeleteProjectTask,
    currentPage,
    pageSize,
    totalCount,
    handlePageChange,
    fetchProjectTaskById,
    searchQuery,
    handleSearch,
  };
};

export default useProjectTasks;
