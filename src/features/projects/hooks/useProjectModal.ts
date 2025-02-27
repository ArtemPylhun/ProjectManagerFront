import { useState, useCallback } from "react";
import {
  ProjectInterface,
  ProjectCreateInterface,
} from "../interfaces/ProjectInterface";
import { UserInterface } from "../../users/interfaces/UserInterface";
import {
  ProjectUserInterface,
  ProjectUserCreateInterface,
} from "../interfaces/ProjectUserInterface";
import { ModalMode, ModalModes } from "../../../types/modalModes";
import useProjects from "../hooks/useProjects";

const useProjectModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(ModalModes.CREATE);

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

  const { fetchProjectById } = useProjects(true);

  const setProjectFromId = useCallback(
    async (projectId: string) => {
      if (!projectId) return;
      const project = await fetchProjectById(
        projectId,
        new AbortController().signal
      );
      if (project) {
        setSelectedProject(project);
        setSelectedClient(project.client || null);
        setSelectedCreator(project.creator || null);
      } else {
        console.warn("Project not found for ID:", projectId);
        setSelectedProject(null);
        setSelectedClient(null);
        setSelectedCreator(null);
      }
    },
    [fetchProjectById]
  );

  const showModal = (
    project: ProjectInterface | null,
    projectUser: ProjectUserInterface | null,
    mode: ModalMode
  ) => {
    setModalMode(mode);
    if (mode !== ModalModes.CREATE && project) {
      setSelectedClient({ ...project.client });
      setSelectedCreator({ ...project.creator });
      setSelectedProjectUser(projectUser);
      setSelectedProject({ ...project });

      if (mode === ModalModes.ADD_USER) {
        setNewProjectUser((prev) => ({
          ...prev!,
          projectId: project.id,
        }));
      }
    } else if (mode === ModalModes.REMOVE_USER && projectUser) {
      setSelectedProjectUser(projectUser);
      if (projectUser.projectId) {
        setProjectFromId(projectUser.projectId);
      }
    } else if (mode === ModalModes.DELETE && selectedProject) {
      setProjectFromId(project?.id || "");
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

  const hideModal = () => {
    setIsModalVisible(false);
    setSelectedProject(null);
    setSelectedClient(null);
    setSelectedCreator(null);
    setSelectedProjectUser(null);
  };

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
    setNewProjectUser,
    setProjectFromId,
  };
};

export default useProjectModal;
