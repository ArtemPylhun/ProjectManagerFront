import { useState, useEffect } from "react";
import { UserService } from "../services/user.service";
import { useLoading } from "../../../hooks/useLoading";
import UserInterface from "../interfaces/UserInterface";
import { message } from "antd";
export const useGetUsers = () => {
  const [users, setUsers] = useState<UserInterface[] | null>(null);

  const { loading, turnOnLoading, turnOffLoading } = useLoading();

  const fetchUsers = async (signal: AbortSignal): Promise<void> => {
    try {
      turnOnLoading();
      const response = await UserService.getAllUsers(signal);
      console.log("response:>>", response);
      if (Array.isArray(response)) {
        setUsers(response as UserInterface[]);
      } else {
        message.error(`Invalid response format: ${response}`);
        setUsers(null);
      }
    } catch (error) {
      message.error(`Error fetching users: ${error}`);
      setUsers(null);
    } finally {
      turnOffLoading();
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchUsers(abortController.signal);
    return () => abortController.abort();
  }, []);

  return {
    users,
    loading,
    setUsers,
    turnOnLoading,
    turnOffLoading,
    fetchUsers,
  };
};
