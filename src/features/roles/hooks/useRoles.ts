import { useState, useCallback, useEffect } from "react";
import { message } from "antd";
import { RoleService } from "../services/role.service";
import {
  RoleCreateInterface,
  RoleInterface,
} from "../interfaces/RoleInterface";
import { useLoading } from "../../../hooks/useLoading";
import { RoleGroupInterface } from "../interfaces/RoleGroupIntreface";

const useRoles = (
  isProjectRoles: boolean,
  isGeneralRoles: boolean,
  isPaginated: boolean
) => {
  const [roles, setRoles] = useState<RoleInterface[] | null>(null);
  const [roleGroups, setRoleGroups] = useState<RoleGroupInterface[] | null>(
    null
  );
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { loading, turnOnLoading, turnOffLoading } = useLoading();

  const fetchRoles = useCallback(
    async (
      signal: AbortSignal,
      searchQueryParam: string = ""
    ): Promise<void> => {
      turnOnLoading();
      try {
        let response;
        if (isPaginated) {
          response = await RoleService.getAllRolesPaginated(
            currentPage,
            pageSize,
            searchQueryParam,
            signal
          );
          console.warn("RESPONSE AFTER SEARCH", response);
          setRoles(response.items ?? []);
          setTotalCount(response.totalCount ?? 0);
          setCurrentPage(response.currentPage ?? 1);
          setPageSize(response.pageSize ?? 1);
        } else {
          const response = isProjectRoles
            ? await RoleService.getProjectRoles(signal)
            : isGeneralRoles
            ? await RoleService.getGeneralRoles(signal)
            : await RoleService.getAllRoles(signal);
          setRoles(response ?? []);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoles([]);
        if (isPaginated) setTotalCount(0);
      } finally {
        turnOffLoading();
      }
    },
    [isPaginated, currentPage, pageSize]
  );

  const fetchRoleGroups = useCallback(
    async (signal: AbortSignal): Promise<boolean> => {
      turnOnLoading();
      try {
        const response = await RoleService.getRoleGroups(signal);
        if (Array.isArray(response)) {
          setRoleGroups(response);
          return true;
        } else {
          console.error("Invalid response format", response);
          return false;
        }
      } catch (error) {
        console.error("Error fetching role groups:", error);
        return false;
      } finally {
        turnOffLoading();
      }
    },
    []
  );

  useEffect(() => {
    const abortController = new AbortController();
    fetchRoles(abortController.signal, searchQuery); // Use searchQuery state here
    if (!isProjectRoles && !isGeneralRoles) {
      fetchRoleGroups(abortController.signal);
    }
    return () => abortController.abort();
  }, [
    fetchRoles,
    fetchRoleGroups,
    searchQuery,
    isProjectRoles,
    isGeneralRoles,
  ]); // Added searchQuery to dependencies

  const handlePageChange = useCallback(
    (page: number, newPageSize?: number) => {
      if (isPaginated) {
        setCurrentPage(page);
        if (newPageSize) setPageSize(newPageSize);
        const abortController = new AbortController();
        fetchRoles(abortController.signal);
        abortController.abort();
      }
    },
    [isPaginated, fetchRoles]
  );

  const handleSearch = useCallback(
    (newSearchQuery: string) => {
      const trimmedQuery = newSearchQuery;
      setSearchQuery(trimmedQuery);
      if (isPaginated) {
        setCurrentPage(1);
        const abortController = new AbortController();
        fetchRoles(abortController.signal, trimmedQuery);
        abortController.abort();
      } else {
        const abortController = new AbortController();
        fetchRoles(abortController.signal, trimmedQuery);
        abortController.abort();
      }
    },
    [isPaginated, fetchRoles]
  );

  const handleCreateRole = async (
    newRole: RoleCreateInterface
  ): Promise<boolean> => {
    try {
      const createdRole = await RoleService.createRole(
        newRole,
        new AbortController().signal
      );
      if (!createdRole) throw new Error("Role creation failed");
      setRoles((prevRoles) =>
        prevRoles ? [...prevRoles, createdRole] : [createdRole]
      );
      setTotalCount((prevCount) => prevCount + 1);

      message.success("Role created successfully");
      return true;
    } catch (error) {
      console.error(`Failed to create role: ${error}`);
      return false;
    }
  };

  const handleUpdateRole = async (
    updatedRole: RoleInterface
  ): Promise<boolean> => {
    try {
      const response = await RoleService.updateRole(
        updatedRole,
        new AbortController().signal
      );
      if (!response) throw new Error("Role update failed");
      setRoles((prevRoles) =>
        prevRoles
          ? prevRoles.map((role) =>
              role.id === updatedRole.id ? updatedRole : role
            )
          : []
      );
      message.success("Role updated successfully");
      return true;
    } catch (error) {
      console.error(`Failed to update role: ${error}`);
      return false;
    }
  };

  const handleDeleteRole = async (roleId: string): Promise<boolean> => {
    try {
      const response = await RoleService.deleteRoleById(
        roleId,
        new AbortController().signal
      );
      if (!response) throw new Error("Role deletion failed");
      setRoles((prevRoles) => {
        const updatedRoles = prevRoles
          ? prevRoles.filter((role) => role.id !== roleId)
          : [];

        if (updatedRoles.length === 0 && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        }

        return updatedRoles;
      });
      setTotalCount((prevCount) => prevCount - 1);
      message.success("Role deleted successfully");
      return true;
    } catch (error) {
      console.error(`Failed to delete role: ${error}`);
      return false;
    }
  };

  return isPaginated
    ? {
        roles,
        roleGroups,
        loading,
        totalCount,
        currentPage,
        pageSize,
        handlePageChange,
        handleSearch,
        handleCreateRole,
        handleUpdateRole,
        handleDeleteRole,
        searchQuery,
        setSearchQuery,
      }
    : {
        roles,
        roleGroups,
        loading,
        handleSearch,
        handleCreateRole,
        handleUpdateRole,
        handleDeleteRole,
        searchQuery,
        setSearchQuery,
      };
};

export default useRoles;
