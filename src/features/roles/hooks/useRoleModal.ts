import { useState } from "react";
import {
  RoleInterface,
  RoleCreateInterface,
} from "../interfaces/RoleInterface";
import { ModalMode, ModalModes } from "../../../types/modalModes";

const useRoleModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(ModalModes.CREATE);
  const [selectedRole, setSelectedRole] = useState<RoleInterface | null>(null);
  const [newRole, setNewRole] = useState<RoleCreateInterface>({
    name: "",
    roleGroup: -1,
  });

  const showModal = (role: RoleInterface | null, mode: ModalMode) => {
    setModalMode(mode);
    if (mode !== ModalModes.CREATE && role) {
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
