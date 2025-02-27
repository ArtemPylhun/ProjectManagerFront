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
const useProjects = (isUserPage: boolean, isPaginated: boolean) => {
  const [projects, setProjects] = useState<ProjectInterface[] | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { loading, turnOnLoading, turnOffLoading } = useLoading();
  const { userId } = useUserId();
  const pageSize = 1;

  const fetchAllProjects = useCallback(
    async (
      signal: AbortSignal
    ): Promise<
      { projects: ProjectInterface[]; totalCount: number } | ProjectInterface[]
    > => {
      turnOnLoading();
      try {
        if (isPaginated) {
          const response = isUserPage
            ? await ProjectService.getAllProjectsByUserIdPaginated(
                userId!,
                currentPage,
                pageSize,
                signal
              )
            : await ProjectService.getAllProjectsPaginated(
                currentPage,
                pageSize,
                signal
              );
          return response;
        } else {
          const response = isUserPage
            ? await ProjectService.getAllProjectsByUserId(userId!, signal)
            : await ProjectService.getAllProjects(signal);
          return response;
        }
      } catch (error) {
        console.error("Error fetching all projects:", error);
        return isPaginated ? { projects: [], totalCount: 0 } : [];
      } finally {
        turnOffLoading();
      }
    },
    [userId, isUserPage, isPaginated, currentPage, pageSize]
  );

  useEffect(() => {
    if (!userId) return;
    const abortController = new AbortController();
    fetchAllProjects(abortController.signal).then((response) => {
      if ("projects" in response && "totalCount" in response) {
        setProjects(response.projects);
        setTotalCount(response.totalCount);
      } else {
        setProjects(response as ProjectInterface[]);
      }
    });
    return () => abortController.abort();
  }, [fetchAllProjects, userId, currentPage, pageSize]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
      setTotalCount((prevCount) => prevCount + 1);
      message.success("Project created successfully");
      return true;
    } catch (error) {
      console.error(`Failed to create project: ${error}`);
      return false;
    }
  };

  const fetchProjectById = useCallback(
    async (id: string, signal: AbortSignal) => {
      try {
        const project = await ProjectService.getProjectById(id, signal);
        if (project) return project;
      } catch (error) {
        console.error("Error fetching project by ID:", error);
      }
      return null;
    },
    []
  );
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
      console.warn("SELECTED PROJECT ID: ", projectId);
      const response = await ProjectService.deleteProjectById(
        projectId,
        new AbortController().signal
      );
      if (!response) throw new Error("Project deletion failed");
      setProjects((prevProjects) => {
        const updatedProjects = prevProjects
          ? prevProjects.filter((project) => project.id !== projectId)
          : [];

        if (updatedProjects.length === 0 && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        }

        return updatedProjects;
      });
      setTotalCount((prevCount) => prevCount - 1);
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
    currentPage,
    pageSize,
    totalCount,
    handlePageChange,
    fetchProjectById,
  };
};

export default useProjects;
