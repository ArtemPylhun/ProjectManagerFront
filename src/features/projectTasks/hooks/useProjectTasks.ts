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

const useProjectTasks = (isUserPage: boolean) => {
  const [projectTasks, setProjectTasks] = useState<
    ProjectTaskInterface[] | null
  >(null);

  const [projectTaskStatuses, setProjectTaskStatuses] = useState<
    ProjectTaskStatusInterface[] | null
  >(null);

  const { loading, turnOnLoading, turnOffLoading } = useLoading();

  const { userId } = useUserId();

  const fetchAllProjectTasks = useCallback(
    async (signal: AbortSignal): Promise<boolean> => {
      turnOnLoading();
      try {
        const response = await ProjectTaskService.getAllProjectTasks(signal);
        console.warn("Fetching all project tasks for Admin: ", response);
        if (Array.isArray(response)) {
          setProjectTasks(response as ProjectTaskInterface[]);
          return true;
        } else {
          console.error(
            "Invalid response format for all project tasks",
            response
          );
          return false;
        }
      } catch (error) {
        console.error("Error fetching all project tasks:", error);
        return false;
      } finally {
        turnOffLoading();
      }
    },
    [] // No dependencies, as this is static for Admins
  );

  const fetchUserProjectTasks = useCallback(
    async (signal: AbortSignal): Promise<boolean> => {
      if (!userId) {
        console.warn("User ID not available yet, skipping fetch");
        return false;
      }

      turnOnLoading();
      try {
        const response = await ProjectTaskService.getAllProjectTasksByUserId(
          userId,
          signal
        );
        console.warn("Fetching user project tasks: ", response);
        if (Array.isArray(response)) {
          setProjectTasks(response as ProjectTaskInterface[]);
          return true;
        } else {
          console.error(
            "Invalid response format for user project tasks",
            response
          );
          return false;
        }
      } catch (error) {
        console.error("Error fetching user project tasks:", error);
        return false;
      } finally {
        turnOffLoading();
      }
    },
    [userId] // Depends on userId for non-Admin users
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
    const abortController = new AbortController();

    const fetchWhenReady = async () => {
      if (isUserPage && userId) {
        await fetchUserProjectTasks(abortController.signal);
      } else {
        await fetchAllProjectTasks(abortController.signal);
      }
    };

    fetchWhenReady();
    fetchProjectTaskStatuses(abortController.signal); // Fetch statuses separately, always

    return () => abortController.abort();
  }, [
    isUserPage,
    userId,
    fetchAllProjectTasks,
    fetchUserProjectTasks,
    fetchProjectTaskStatuses,
  ]);

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
      setProjectTasks((prevProjectTasks) =>
        prevProjectTasks
          ? prevProjectTasks.filter(
              (projectTask) => projectTask.id !== projectTaskId
            )
          : []
      );
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
  };
};

export default useProjectTasks;
