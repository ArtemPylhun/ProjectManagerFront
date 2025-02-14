import { useState } from "react";
import {
  RoleInterface,
  RoleCreateInterface,
} from "../interfaces/RoleInterface";

const useRoleModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "delete" | "update">(
    "create"
  );
  const [selectedRole, setSelectedRole] = useState<RoleInterface | null>(null);
  const [newRole, setNewRole] = useState<RoleCreateInterface>({
    name: "",
    roleGroup: -1,
  });

  const showModal = (role: RoleInterface | null, mode: typeof modalMode) => {
    setModalMode(mode);
    if (mode !== "create" && role) {
      setSelectedRole({ ...role });
    } else {
      setNewRole({ name: "", roleGroup: -1 });
    }
    setIsModalVisible(true);
  };

  const hideModal = () => setIsModalVisible(false);

  return {
    modalMode,
    isModalVisible,
    selectedRole,
    newRole,
    showModal,
    hideModal,
    setNewRole,
    setSelectedRole,
  };
};

export default useRoleModal;
