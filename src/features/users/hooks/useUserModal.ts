import { useState } from "react";
import { UserInterface } from "../interfaces/UserInterface";
import { ModalModes, ModalMode } from "../../../types/modalModes";

const useUserModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(ModalModes.CREATE);
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [newUser, setNewUser] = useState<UserInterface>({
    id: "",
    email: "",
    userName: "",
    password: "",
    roles: [],
  });

  const showModal = (user: UserInterface | null, mode: ModalMode) => {
    setModalMode(mode);
    if (mode !== ModalModes.CREATE && user) {
      setSelectedUser({ ...user });
      setSelectedRoles(user.roles || []);
    } else {
      setNewUser({ id: "", email: "", userName: "", password: "", roles: [] });
    }
    setIsModalVisible(true);
  };

  const hideModal = () => setIsModalVisible(false);

  return {
    modalMode,
    isModalVisible,
    selectedUser,
    selectedRoles,
    newUser,
    showModal,
    hideModal,
    setSelectedRoles,
    setNewUser,
    setSelectedUser,
  };
};

export default useUserModal;
