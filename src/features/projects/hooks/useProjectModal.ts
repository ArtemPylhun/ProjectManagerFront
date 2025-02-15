import { useState } from "react";
import {
  ProjectInterface,
  ProjectCreateInterface,
} from "../interfaces/ProjectInterface";
import { UserInterface } from "../../users/interfaces/UserInterface";
import {
  ProjectUserInterface,
  ProjectUserCreateInterface,
} from "../interfaces/ProjectUserInterface";

const useProjectModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<
    "create" | "delete" | "update" | "add_user" | "remove_user"
  >("create");

  const [selectedProject, setSelectedProject] =
    useState<ProjectInterface | null>(null);

  const [selectedClient, setSelectedClient] = useState<UserInterface | null>(
    null
  );
  const [selectedCreator, setSelectedCreator] = useState<UserInterface | null>(
    null
  );

  const [selectedProjectUser, setSelectedProjectUser] =
    useState<ProjectUserInterface | null>(null);

  const [newProjectUser, setNewProjectUser] =
    useState<ProjectUserCreateInterface | null>({
      projectId: "",
      roleId: "",
      userId: "",
    });

  const [newProject, setNewProject] = useState<ProjectCreateInterface>({
    name: "",
    description: "",
    colorHex: "",
    creatorId: "",
    clientId: "",
  });

  const showModal = (
    project: ProjectInterface | null,
    projectUser: ProjectUserInterface | null,
    mode: typeof modalMode
  ) => {
    setModalMode(mode);
    if (mode !== "create" && project) {
      setSelectedClient(project.client);
      setSelectedProjectUser(projectUser);
      setSelectedProject({ ...project });

      if (mode === "add_user") {
        setNewProjectUser((prev) => ({
          ...prev!,
          projectId: project.id,
        }));
      }
    } else if (mode === "remove_user" && projectUser) {
      setSelectedProjectUser(projectUser);
    } else {
      setSelectedClient(null);
      setSelectedCreator(null);
      setNewProjectUser({
        projectId: project?.id || "",
        roleId: "",
        userId: "",
      });
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
    newProjectUser,
    selectedClient,
    selectedCreator,
    selectedProjectUser,
    showModal,
    hideModal,
    setNewProject,
    setSelectedProject,
    setSelectedClient,
    setSelectedCreator,
    setSelectedProjectUser,
    setNewProjectUser,
  };
};

export default useProjectModal;
