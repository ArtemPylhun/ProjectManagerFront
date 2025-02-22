import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { UserInterface } from "../interfaces/UserInterface";
import { UserService } from "../services/user.service";
import { useLoading } from "../../../hooks/useLoading";

const useUsers = () => {
  const [users, setUsers] = useState<UserInterface[] | null>(null);

  const { loading, turnOnLoading, turnOffLoading } = useLoading();

  const fetchUsers = useCallback(async (signal: AbortSignal) => {
    turnOnLoading();
    try {
      const response = await UserService.getAllUsers(signal);
      if (Array.isArray(response)) {
        setUsers(response as UserInterface[]);
        return true;
      } else {
        message.error(`Invalid response format: ${response}`);
        return false;
      }
    } catch (error) {
      message.error(`Error fetching users: ${error}`);
      return false;
    } finally {
      turnOffLoading();
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchUsers(abortController.signal);
    return () => abortController.abort();
  }, [fetchUsers]);

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
      setUsers((prevUsers) =>
        prevUsers ? prevUsers.filter((user) => user.id !== userId) : []
      );
      message.success("User deleted successfully!");
      return true;
    } catch (error) {
      console.error(`Failed to delete user: ${error}`);
      return false;
    }
  };

  return {
    users,
    loading,
    fetchUsers,
    handleCreateUser,
    handleUpdateUser,
    handleUpdateRoles,
    handleDeleteUser,
  };
};

export default useUsers;
