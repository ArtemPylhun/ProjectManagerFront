import { useState, useCallback, useEffect } from "react";
import {
  ProjectTaskInterface,
  ProjectTaskCreateInterface,
  ProjectTaskUpdateInterface,
} from "../interfaces/ProjectTaskInterface";
import { ProjectTaskService } from "../services/project.task.service";
import { useLoading } from "../../../hooks/useLoading";
import { message } from "antd";
import { UserTaskCreateInterface } from "../interfaces/UserTaskInterface";
import { ProjectTaskStatusInterface } from "../interfaces/ProjectTaskStatusInterface";
import useUserId from "../../../hooks/useUserId";

const useProjectTasks = (isUserPage: boolean, isPaginated: boolean) => {
  const [projectTasks, setProjectTasks] = useState<
    ProjectTaskInterface[] | null
  >(null);

  const [projectTaskStatuses, setProjectTaskStatuses] = useState<
    ProjectTaskStatusInterface[] | null
  >(null);

  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { loading, turnOnLoading, turnOffLoading } = useLoading();

  const { userId } = useUserId();
  const pageSize = 1;

  const fetchAllProjectTasks = useCallback(
    async (
      signal: AbortSignal
    ): Promise<
      | { projectTasks: ProjectTaskInterface[]; totalCount: number }
      | ProjectTaskInterface[]
    > => {
      turnOnLoading();
      try {
        if (isPaginated) {
          const response = isUserPage
            ? await ProjectTaskService.getAllProjectTasksByUserIdPaginated(
                userId!,
                currentPage,
                pageSize,
                signal
              )
            : await ProjectTaskService.getAllProjectTasksPaginated(
                currentPage,
                pageSize,
                signal
              );
          return response;
        } else {
          const response = isUserPage
            ? await ProjectTaskService.getAllProjectTasksByUserId(
                userId!,
                signal
              )
            : await ProjectTaskService.getAllProjectTasks(signal);
          return response;
        }
      } catch (error) {
        console.error("Error fetching project tasks:", error);
        return isPaginated ? { projectTasks: [], totalCount: 0 } : [];
      } finally {
        turnOffLoading();
      }
    },
    [userId, isUserPage, currentPage]
  );

  const fetchProjectTaskStatuses = useCallback(
    async (signal: AbortSignal): Promise<boolean> => {
      turnOnLoading();
      try {
        const response = await ProjectTaskService.getAllTaskStatuses(signal);
        console.log("Project Task Statuses: ", response);
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
    if (!userId) return;
    const abortController = new AbortController();
    fetchAllProjectTasks(abortController.signal).then((response) => {
      if ("projectTasks" in response && "totalCount" in response) {
        setProjectTasks(response.projectTasks);
        setTotalCount(response.totalCount);
      } else {
        setProjectTasks(response as ProjectTaskInterface[]);
      }
    });
    fetchProjectTaskStatuses(abortController.signal);
    return () => abortController.abort();
  }, [
    fetchAllProjectTasks,
    fetchProjectTaskStatuses,
    userId,
    currentPage,
    totalCount,
  ]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
                    usersTask: projectTask.usersTask,
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

  const handleAddUserToProjectTask = async (
    userTask: UserTaskCreateInterface
  ): Promise<boolean> => {
    try {
      console.log("userTask: ", userTask);
      const response = await ProjectTaskService.addUserToTask(
        userTask,
        new AbortController().signal
      );
      if (!response) throw new Error("Adding user to project task failed");

      setProjectTasks((prevProjectTasks) =>
        prevProjectTasks
          ? prevProjectTasks.map((projectTask) =>
              projectTask.id === userTask.projectTaskId
                ? {
                    ...projectTask,
                    usersTask: [
                      ...projectTask.usersTask,
                      {
                        id: response.id,
                        projectTaskId: response.projectTaskId,
                        userId: response.userId,
                      },
                    ],
                  }
                : projectTask
            )
          : []
      );
      message.success("User added to project task successfully");
      return true;
    } catch (error) {
      console.error(`Failed to add user to project task: ${error}`);
      return false;
    }
  };

  const handleRemoveUserFromProjectTask = async (
    userTaskId: string
  ): Promise<boolean> => {
    try {
      const response = await ProjectTaskService.removeUserFromTask(
        userTaskId,
        new AbortController().signal
      );
      if (!response) throw new Error("User deletion from project task failed");

      setProjectTasks((prevProjectTasks) =>
        prevProjectTasks
          ? prevProjectTasks.map((projectTask) =>
              projectTask.id === response.projectTaskId
                ? {
                    ...projectTask,
                    usersTask: projectTask.usersTask.filter(
                      (projectUser) => projectUser.id !== userTaskId
                    ),
                  }
                : projectTask
            )
          : []
      );
      message.success("User removed from project task successfully");
      return true;
    } catch (error) {
      console.error(`Failed to remove user from project task: ${error}`);
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
    handleAddUserToProjectTask,
    handleRemoveUserFromProjectTask,
    currentPage,
    pageSize,
    totalCount,
    handlePageChange,
    fetchProjectTaskById,
  };
};

export default useProjectTasks;
