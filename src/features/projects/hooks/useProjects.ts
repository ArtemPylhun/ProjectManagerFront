import { useState, useCallback, useEffect } from "react";
import { message } from "antd";
import {
  ProjectInterface,
  ProjectCreateInterface,
  ProjectUpdateInterface,
} from "../interfaces/ProjectInterface";
import { ProjectService } from "../services/project.service";
import { UserService } from "../../users/services/user.service";
import { useLoading } from "../../../hooks/useLoading";
const useProjects = () => {
  const [projects, setProjects] = useState<ProjectInterface[] | null>(null);

  const { loading, turnOnLoading, turnOffLoading } = useLoading();

  const fetchProjects = useCallback(
    async (signal: AbortSignal): Promise<boolean> => {
      turnOnLoading();
      try {
        const response = await ProjectService.getAllProjects(signal);
        if (Array.isArray(response)) {
          setProjects(response as ProjectInterface[]);
          console.log("Projects: ", response);
          return true;
        } else {
          console.error("Invalid response format", response);
          return false;
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        return false;
      } finally {
        turnOffLoading();
      }
    },
    []
  );

  useEffect(() => {
    const abortController = new AbortController();
    fetchProjects(abortController.signal);
    return () => abortController.abort();
  }, [fetchProjects]);

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
      message.error(`Failed to create role: ${error}`);
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
                    creator: project.creator,
                    client: updatedClient,
                  }
                : project
            )
          : []
      );
      message.success("Project updated successfully");
      return true;
    } catch (error) {
      message.error(`Failed to update project: ${error}`);
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
      message.error(`Failed to delete project: ${error}`);
      return false;
    }
  };

  return {
    projects,
    loading,
    fetchProjects,
    handleDeleteProject,
    handleCreateProject,
    handleUpdateProject,
  };
};

export default useProjects;
