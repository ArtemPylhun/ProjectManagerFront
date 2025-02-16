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

const useProjectTasks = () => {
  const [projectTasks, setProjectTasks] = useState<
    ProjectTaskInterface[] | null
  >(null);

  const [projectTaskStatuses, setProjectTaskStatuses] = useState<
    ProjectTaskStatusInterface[] | null
  >(null);

  const { loading, turnOnLoading, turnOffLoading } = useLoading();

  const fetchProjectTasks = useCallback(
    async (signal: AbortSignal): Promise<boolean> => {
      turnOnLoading();
      try {
        const response = await ProjectTaskService.getAllProjectTasks(signal);
        console.log("Project Tasks: ", response);
        if (Array.isArray(response)) {
          setProjectTasks(response as ProjectTaskInterface[]);
          return true;
        } else {
          console.error("Invalid response format", response);
          return false;
        }
      } catch (error) {
        console.error("Error fetching project tasks:", error);
        return false;
      } finally {
        turnOffLoading();
      }
    },
    []
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
    fetchProjectTasks(abortController.signal);
    fetchProjectTaskStatuses(abortController.signal);
    return () => abortController.abort();
  }, [fetchProjectTasks, fetchProjectTaskStatuses]);

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
      message.error(`Failed to create project task: ${error}`);
      return false;
    }
  };

  const handleUpdateProjectTask = async (
    updatedProjectTask: ProjectTaskUpdateInterface
  ): Promise<boolean> => {
    try {
      console.log("Updated project task: ", updatedProjectTask);
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
      message.error(`Failed to update project task: ${error}`);
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
      message.error(`Failed to delete project task: ${error}`);
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
      message.error(`Failed to add user to project task: ${error}`);
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
      message.error(`Failed to remove user from project task: ${error}`);
      return false;
    }
  };

  return {
    projectTasks,
    projectTaskStatuses,
    loading,
    fetchProjectTasks,
    handleCreateProjectTask,
    handleUpdateProjectTask,
    handleDeleteProjectTask,
    handleAddUserToProjectTask,
    handleRemoveUserFromProjectTask,
  };
};

export default useProjectTasks;
