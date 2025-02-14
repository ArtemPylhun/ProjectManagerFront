import { useState } from "react";
import {
  ProjectInterface,
  ProjectCreateInterface,
} from "../interfaces/ProjectInterface";
import { UserInterface } from "../../users/interfaces/UserInterface";

const useProjectModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "delete" | "update">(
    "create"
  );
  const [selectedProject, setSelectedProject] =
    useState<ProjectInterface | null>(null);

  const [selectedClient, setSelectedClient] = useState<UserInterface | null>(
    null
  );
  const [selectedCreator, setSelectedCreator] = useState<UserInterface | null>(
    null
  );
  const [newProject, setNewProject] = useState<ProjectCreateInterface>({
    name: "",
    description: "",
    colorHex: "",
    creatorId: "",
    clientId: "",
  });

  const showModal = (
    project: ProjectInterface | null,
    mode: typeof modalMode
  ) => {
    setModalMode(mode);
    if (mode !== "create" && project) {
      setSelectedClient(project.client);
      setSelectedProject({ ...project });
    } else {
      setSelectedClient(null);
      setSelectedCreator(null);
      setNewProject({
        name: "",
        description: "",
        colorHex: "#ffffff",
        creatorId: "",
        clientId: "",
      });
    }
    setIsModalVisible(true);
  };

  const hideModal = () => setIsModalVisible(false);

  return {
    modalMode,
    isModalVisible,
    selectedProject,
    newProject,
    selectedClient,
    selectedCreator,
    showModal,
    hideModal,
    setNewProject,
    setSelectedProject,
    setSelectedClient,
    setSelectedCreator,
  };
};

export default useProjectModal;
