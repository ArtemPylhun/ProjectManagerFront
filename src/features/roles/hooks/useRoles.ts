import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { RoleService } from "../services/role.service";
import {
  RoleCreateInterface,
  RoleInterface,
} from "../interfaces/RoleInterface";
import { useLoading } from "../../../hooks/useLoading";
import { RoleGroupInterface } from "../interfaces/RoleGroupIntreface";

const useRoles = (isProjectRoles: boolean, isGeneralRoles: boolean) => {
  const [roles, setRoles] = useState<RoleInterface[] | null>(null);

  const [roleGroups, setRoleGroups] = useState<RoleGroupInterface[] | null>(
    null
  );

  const { loading, turnOnLoading, turnOffLoading } = useLoading();

  const fetchRoles = useCallback(
    async (signal: AbortSignal): Promise<boolean> => {
      turnOnLoading();
      try {
        const response = isProjectRoles
          ? await RoleService.getProjectRoles(signal)
          : isGeneralRoles
          ? await RoleService.getGeneralRoles(signal)
          : await RoleService.getAllRoles(signal);
        console.log("Roles: ", response);
        if (Array.isArray(response)) {
          setRoles(response as RoleInterface[]);
          return true;
        } else {
          console.error("Invalid response format", response);
          return false;
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        return false;
      } finally {
        turnOffLoading();
      }
    },
    []
  );

  const fetchRoleGroups = useCallback(
    async (signal: AbortSignal): Promise<boolean> => {
      turnOnLoading();
      try {
        const response = await RoleService.getRoleGroups(signal);
        console.log("Role Groups: ", response);
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
    fetchRoles(abortController.signal);
    fetchRoleGroups(abortController.signal);
    return () => abortController.abort();
  }, [fetchRoles, fetchRoleGroups]);

  const handleCreateRole = async (
    newRole: RoleCreateInterface
  ): Promise<boolean> => {
    try {
      console.log(newRole);
      const createdRole = await RoleService.createRole(
        newRole,
        new AbortController().signal
      );
      if (!createdRole) throw new Error("Role creation failed");
      setRoles((prevRoles) =>
        prevRoles ? [...prevRoles, createdRole] : [createdRole]
      );
      message.success("Role created successfully");
      return true;
    } catch (error) {
      message.error(`Failed to create role: ${error}`);
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
      message.error(`Failed to update role: ${error}`);
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
      setRoles((prevRoles) =>
        prevRoles ? prevRoles.filter((role) => role.id !== roleId) : []
      );
      message.success("Role deleted successfully");
      return true;
    } catch (error) {
      message.error(`Failed to delete role: ${error}`);
      return false;
    }
  };

  return {
    roles,
    roleGroups,
    loading,
    fetchRoles,
    fetchRoleGroups,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
  };
};

export default useRoles;
