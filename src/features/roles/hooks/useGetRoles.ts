import { useState, useEffect } from "react";
import { RoleService } from "../services/role.service";
import { useLoading } from "../../../hooks/useLoading";
import RoleInterface from "../interfaces/RoleInterface";
export const useGetRoles = () => {
  const [roles, setRoles] = useState<RoleInterface[] | null>(null);

  const { loading, turnOnLoading, turnOffLoading } = useLoading();

  const fetchRoles = async (signal: AbortSignal): Promise<void> => {
    try {
      turnOnLoading();
      const response = await RoleService.getAllRoles(signal);
      console.log("response:>>", response);
      if (Array.isArray(response)) {
        setRoles(response as RoleInterface[]);
      } else {
        console.error("Invalid response format", response);
        setRoles(null);
      }
    } catch (error) {
      // showNotification(error.message, {
      //   severity: "error",
      //   autoHideDuration: 5000,
      // });
      console.error("Error fetching users:", error);
      setRoles(null);
    } finally {
      turnOffLoading();
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchRoles(abortController.signal);
    return () => abortController.abort();
  }, []);

  return {
    roles,
    loading,
    setRoles,
    turnOnLoading,
    turnOffLoading,
    fetchRoles,
  };
};
