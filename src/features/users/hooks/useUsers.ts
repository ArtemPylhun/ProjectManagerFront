import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { UserInterface } from "../interfaces/UserInterface";
import { UserService } from "../services/user.service";
import { useLoading } from "../../../hooks/useLoading";
import useUserId from "../../../hooks/useUserId";

const useUsers = (isPaginated: boolean = true, projectId?: string) => {
  const [users, setUsers] = useState<UserInterface[] | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { loading, turnOnLoading, turnOffLoading } = useLoading();
  const { userId, isAdmin } = useUserId();

  const fetchUsers = useCallback(
    async (
      signal: AbortSignal,
      searchQuery: string = "",
      userId: string,
      isAdmin: boolean
    ): Promise<void> => {
      turnOnLoading();
      try {
        let response;
        if (isPaginated) {
          response = await UserService.getAllUsersPaginated(
            currentPage,
            pageSize,
            searchQuery,
            signal
          );
          setUsers(response.items);
          setCurrentPage(response.currentPage);
          setPageSize(response.pageSize);
          setTotalCount(response.totalCount);
        } else {
          if (isAdmin) {
            response = await UserService.getAllUsers(signal);
          } else if (!isAdmin && projectId) {
            response = await UserService.getUsersByProjectId(
              projectId || "",
              signal
            );
            console.warn("Found users with roles by project id:", response);
          } else if (userId) {
            response = await UserService.getUserWithRolesById(userId, signal);
          }

          if (response && Array.isArray(response)) {
            setUsers(response);
          } else if (response) {
            setUsers([response]);
          } else {
            setUsers([]);
          }
          console.warn("Found users", users);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
        if (isPaginated) setTotalCount(0);
      } finally {
        turnOffLoading();
      }
    },
    [isPaginated, currentPage, pageSize]
  );

  const fetchUserById = useCallback(
    async (
      userId: string,
      signal: AbortSignal
    ): Promise<UserInterface | null> => {
      turnOnLoading();
      try {
        return await UserService.getUserWithRolesById(userId, signal);
      } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
      } finally {
        turnOffLoading();
      }
    },
    []
  );

  useEffect(() => {
    if (!userId && !isAdmin) return;
    const abortController = new AbortController();
    fetchUsers(abortController.signal, searchQuery, userId || "", isAdmin);
    return () => abortController.abort();
  }, [fetchUsers, userId, isAdmin, searchQuery]);

  const handlePageChange = useCallback(
    (page: number, newPageSize?: number) => {
      if (isPaginated) {
        setCurrentPage(page);
        if (newPageSize) setPageSize(newPageSize);
        const abortController = new AbortController();
        fetchUsers(abortController.signal, searchQuery, userId || "", isAdmin);
        abortController.abort();
      }
    },
    [isPaginated, fetchUsers]
  );

  const handleSearch = useCallback(
    (newSearchQuery: string) => {
      const trimmedQuery = newSearchQuery;
      setSearchQuery(trimmedQuery);
      if (isPaginated) {
        setCurrentPage(1);
        const abortController = new AbortController();
        fetchUsers(abortController.signal, trimmedQuery, userId || "", isAdmin);
        abortController.abort();
      } else {
        const abortController = new AbortController();
        fetchUsers(abortController.signal, trimmedQuery, userId || "", isAdmin);
        abortController.abort();
      }
    },
    [isPaginated, fetchUsers]
  );

  const handleCreateUser = async (newUser: UserInterface): Promise<boolean> => {
    try {
      const createdUser = await UserService.registerUser(
        newUser,
        new AbortController().signal
      );
      if (!createdUser) throw new Error("User creation failed");
      const userWithRoles = await UserService.getUserWithRolesById(
        createdUser.id,
        new AbortController().signal
      );
      setUsers((prevUsers) =>
        prevUsers ? [...prevUsers, userWithRoles] : [userWithRoles]
      );
      setTotalCount((prevCount) => prevCount + 1);

      message.success("User created successfully!");
      return true;
    } catch (error) {
      console.error(`Failed to create user: ${error}`);
      return false;
    }
  };

  const handleUpdateUser = async (
    updatedUser: UserInterface
  ): Promise<boolean> => {
    try {
      const response = await UserService.updateUser(
        updatedUser,
        new AbortController().signal
      );
      if (!response) throw new Error("Update failed");
      setUsers((prevUsers) =>
        prevUsers
          ? prevUsers.map((user) =>
              user.id === updatedUser.id ? updatedUser : user
            )
          : []
      );
      message.success("User updated successfully!");
      return true;
    } catch (error) {
      console.error(`Failed to update user: ${error}`);
      return false;
    }
  };

  const handleUpdateRoles = async (
    userId: string,
    newRoles: string[]
  ): Promise<boolean> => {
    try {
      const response = await UserService.updateRoles(
        userId,
        newRoles,
        new AbortController().signal
      );
      if (!response) throw new Error("Role update failed");
      setUsers((prevUsers) =>
        prevUsers
          ? prevUsers.map((user) =>
              user.id === userId ? { ...user, roles: newRoles } : user
            )
          : []
      );
      message.success("Roles updated successfully!");
      return true;
    } catch (error) {
      console.error(`Failed to update roles: ${error}`);
      return false;
    }
  };

  const handleDeleteUser = async (userId: string): Promise<boolean> => {
    try {
      const response = await UserService.deleteUserById(
        userId,
        new AbortController().signal
      );
      if (!response) throw new Error("Delete failed");
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers
          ? prevUsers.filter((user) => user.id !== userId)
          : [];

        if (updatedUsers.length === 0 && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        }

        return updatedUsers;
      });
      setTotalCount((prevCount) => prevCount - 1);
      message.success("User deleted successfully!");
      return true;
    } catch (error) {
      console.error(`Failed to delete user: ${error}`);
      return false;
    }
  };

  return isPaginated
    ? {
        users,
        loading,
        totalCount,
        currentPage,
        pageSize,
        handlePageChange,
        handleSearch,
        handleCreateUser,
        handleUpdateUser,
        handleUpdateRoles,
        handleDeleteUser,
        searchQuery,
        setSearchQuery,
        fetchUserById,
      }
    : {
        users,
        loading,
        handleSearch,
        handleCreateUser,
        handleUpdateUser,
        handleUpdateRoles,
        handleDeleteUser,
        searchQuery,
        setSearchQuery,
        fetchUserById,
      };
};

export default useUsers;
