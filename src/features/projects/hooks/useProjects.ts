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
const useProjects = (isPaginated: boolean) => {
  const [projects, setProjects] = useState<ProjectInterface[] | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(5);
  const { loading, turnOnLoading, turnOffLoading } = useLoading();
  const { userId, isAdmin } = useUserId();

  const fetchAllProjects = useCallback(
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
            ? await ProjectService.getAllProjectsPaginated(
                currentPage,
                pageSize,
                search,
                signal
              )
            : await ProjectService.getAllProjectsByUserIdPaginated(
                userId!,
                currentPage,
                pageSize,
                search,
                signal
              );
          setProjects(response.items);
          setTotalCount(response.totalCount);
        } else {
          const response = isAdmin
            ? await ProjectService.getAllProjects(signal)
            : await ProjectService.getAllProjectsByUserId(userId!, signal);
          setProjects(response ?? []);
        }
      } catch (error) {
        console.error("Error fetching all projects:", error);
        setProjects([]);
      } finally {
        turnOffLoading();
      }
    },
    [isPaginated, currentPage, pageSize]
  );

  useEffect(() => {
    if (!userId && !isAdmin) return;
    const abortController = new AbortController();
    fetchAllProjects(
      abortController.signal,
      searchQuery,
      userId || "",
      isAdmin
    );
    return () => abortController.abort();
  }, [fetchAllProjects, userId, isAdmin, searchQuery]);

  const handlePageChange = useCallback(
    (page: number, newPageSize?: number) => {
      if (isPaginated) {
        setCurrentPage(page);
        if (newPageSize) setPageSize(newPageSize);
        const abortController = new AbortController();
        fetchAllProjects(
          abortController.signal,
          searchQuery,
          userId || "",
          isAdmin
        );
        abortController.abort();
      }
    },
    [isPaginated, fetchAllProjects]
  );

  const handleSearch = useCallback(
    (newSearchQuery: string) => {
      const query = newSearchQuery;
      setSearchQuery(query);
      if (isPaginated) {
        setCurrentPage(1);
        const abortController = new AbortController();
        fetchAllProjects(abortController.signal, query, userId || "", isAdmin);
        abortController.abort();
      } else {
        const abortController = new AbortController();
        fetchAllProjects(abortController.signal, query, userId || "", isAdmin);
        abortController.abort();
      }
    },
    [isPaginated, fetchAllProjects]
  );

  const handleCreateProject = async (
    newProject: ProjectCreateInterface
  ): Promise<boolean> => {
    try {
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
    searchQuery,
    totalCount,
    handlePageChange,
    fetchProjectById,
    handleSearch,
    isAdmin,
    userId,
  };
};

export default useProjects;
