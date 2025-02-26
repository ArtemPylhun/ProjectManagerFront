import { useState, useCallback, useEffect } from "react";
import { message } from "antd";
import {
  ProjectInterface,
  ProjectCreateInterface,
  ProjectUpdateInterface,
} from "../interfaces/ProjectInterface";
import { ProjectService } from "../services/project.service";
import { UserService } from "../../users/services/user.service";
import { ProjectUserCreateInterface } from "../interfaces/ProjectUserInterface";
import { useLoading } from "../../../hooks/useLoading";
import useUserId from "../../../hooks/useUserId";
const useProjects = (isUserPage: boolean) => {
  const [projects, setProjects] = useState<ProjectInterface[] | null>(null);

  const { loading, turnOnLoading, turnOffLoading } = useLoading();

  const { userId } = useUserId();

  const fetchAllProjects = useCallback(
    async (signal: AbortSignal): Promise<boolean> => {
      turnOnLoading();
      try {
        const response = await ProjectService.getAllProjects(signal);
        if (Array.isArray(response)) {
          setProjects(response as ProjectInterface[]);
          return true;
        } else {
          console.error("Invalid response format for all projects", response);
          return false;
        }
      } catch (error) {
        console.error("Error fetching all projects:", error);
        return false;
      } finally {
        turnOffLoading();
      }
    },
    []
  );

  const fetchUserProjects = useCallback(
    async (signal: AbortSignal): Promise<boolean> => {
      if (!userId) {
        console.warn("User ID not available yet, skipping fetch");
        return false;
      }

      turnOnLoading();
      try {
        const response = await ProjectService.getAllProjectsByUserId(
          userId,
          signal
        );
        console.warn("Fetching user projects: ", response);
        if (Array.isArray(response)) {
          setProjects(response as ProjectInterface[]);
          return true;
        } else {
          console.error("Invalid response format for user projects", response);
          return false;
        }
      } catch (error) {
        console.error("Error fetching user projects:", error);
        return false;
      } finally {
        turnOffLoading();
      }
    },
    [userId] // Depends on userId for non-Admin users
  );

  useEffect(() => {
    const abortController = new AbortController();

    const fetchWhenReady = async () => {
      if (isUserPage && userId) {
        await fetchUserProjects(abortController.signal);
      } else {
        await fetchAllProjects(abortController.signal);
      }
    };

    fetchWhenReady();

    return () => abortController.abort();
  }, [isUserPage, userId, fetchAllProjects, fetchUserProjects]);

  const handleCreateProject = async (
    newProject: ProjectCreateInterface
  ): Promise<boolean> => {
    try {
      console.log("NewProject: ", newProject);
      const createdProject = await ProjectService.createProject(
        newProject,
        new AbortController().signal
      );
      if (!createdProject) throw new Error("Project creation failed");
      setProjects((prevProjects) =>
        prevProjects ? [...prevProjects, createdProject] : [createdProject]
      );
      message.success("Project created successfully");
      return true;
    } catch (error) {
      console.error(`Failed to create project: ${error}`);
      return false;
    }
  };

  const handleUpdateProject = async (
    updatedProject: ProjectUpdateInterface
  ): Promise<boolean> => {
    try {
      console.log("Updated project: ", updatedProject);
      const response = await ProjectService.updateProject(
        updatedProject,
        new AbortController().signal
      );
      if (!response) throw new Error("Project update failed");
      let updatedClient = await UserService.getUserWithRolesById(
        response.client.id,
        new AbortController().signal
      );

      setProjects((prevProjects) =>
        prevProjects
          ? prevProjects.map((project) =>
              project.id === updatedProject.id
                ? {
                    ...updatedProject,
                    createdAt: response.createdAt,
                    creator: project.creator,
                    client: updatedClient,
                    projectUsers: project.projectUsers,
                  }
                : project
            )
          : []
      );
      message.success("Project updated successfully");
      return true;
    } catch (error) {
      console.error(`Failed to update project: ${error}`);
      return false;
    }
  };

  const handleDeleteProject = async (projectId: string): Promise<boolean> => {
    try {
      const response = await ProjectService.deleteProjectById(
        projectId,
        new AbortController().signal
      );
      if (!response) throw new Error("Project deletion failed");
      setProjects((prevProjects) =>
        prevProjects
          ? prevProjects.filter((project) => project.id !== projectId)
          : []
      );
      message.success("Project deleted successfully");
      return true;
    } catch (error) {
      console.error(`Failed to delete project: ${error}`);
      return false;
    }
  };

  const handleAddUserToProject = async (
    projectUser: ProjectUserCreateInterface
  ): Promise<boolean> => {
    try {
      console.log("projectUser: ", projectUser);
      const response = await ProjectService.addUserToProject(
        projectUser,
        new AbortController().signal
      );
      if (!response) throw new Error("Adding user to project failed");

      setProjects((prevProjects) =>
        prevProjects
          ? prevProjects.map((project) =>
              project.id === projectUser.projectId
                ? {
                    ...project,
                    projectUsers: [
                      ...project.projectUsers,
                      {
                        id: response.id,
                        projectId: response.projectId,
                        roleId: response.roleId,
                        userId: response.userId,
                      },
                    ],
                  }
                : project
            )
          : []
      );
      message.success("User added to project successfully");
      return true;
    } catch (error) {
      console.error(`Failed to add user to project: ${error}`);
      return false;
    }
  };

  const handleRemoveUserFromProject = async (
    projectUserId: string
  ): Promise<boolean> => {
    try {
      const response = await ProjectService.removeUserFromProject(
        projectUserId,
        new AbortController().signal
      );
      if (!response) throw new Error("User deletion from project failed");

      setProjects((prevProjects) =>
        prevProjects
          ? prevProjects.map((project) =>
              project.id === response.projectId
                ? {
                    ...project,
                    projectUsers: project.projectUsers.filter(
                      (projectUser) => projectUser.id !== projectUserId
                    ),
                  }
                : project
            )
          : []
      );
      message.success("User removed from project successfully");
      return true;
    } catch (error) {
      console.error(`Failed to remove user from project: ${error}`);
      return false;
    }
  };

  return {
    projects,
    loading,
    handleDeleteProject,
    handleCreateProject,
    handleUpdateProject,
    handleAddUserToProject,
    handleRemoveUserFromProject,
  };
};

export default useProjects;
