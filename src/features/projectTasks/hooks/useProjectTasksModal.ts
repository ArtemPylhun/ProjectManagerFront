import { useEffect, useState } from "react";
import {
  ProjectTaskInterface,
  ProjectTaskCreateInterface,
} from "../interfaces/ProjectTaskInterface";
import { ProjectInterface } from "../../projects/interfaces/ProjectInterface";
import { ModalMode, ModalModes } from "../../../types/modalModes";
import useUserId from "../../../hooks/useUserId";
import { UserInterface } from "../../users/interfaces/UserInterface";

const useProjectTasksModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(ModalModes.CREATE);
  const { isAdmin, loggedInUser } = useUserId();

  const [selectedProjectTask, setSelectedProjectTask] =
    useState<ProjectTaskInterface | null>(null);
  const [selectedProject, setSelectedProject] =
    useState<ProjectInterface | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<UserInterface | null>(
    null
  );
  const [newProjectTask, setNewProjectTask] =
    useState<ProjectTaskCreateInterface>({
      creatorId: "",
      projectId: "",
      name: "",
      estimatedTime: 0,
      description: "",
      status: 0,
    });

  useEffect(() => {
    if (!isAdmin && !loggedInUser) {
      return;
    }
  }, [isAdmin, loggedInUser]);
  const showModal = (
    projectTask: ProjectTaskInterface | null,
    mode: ModalMode
  ) => {
    setModalMode(mode);
    if (mode !== ModalModes.CREATE && projectTask) {
      setSelectedProject({ ...projectTask.project });
      setSelectedCreator({ ...projectTask.creator });
      setSelectedProjectTask({ ...projectTask });
    } else {
      setSelectedProject(null);
      if (!isAdmin && loggedInUser) {
        setSelectedCreator(loggedInUser);
        setNewProjectTask({
          creatorId: loggedInUser.id,
          projectId: projectTask?.project.id || "",
          name: "",
          estimatedTime: 0,
          description: "",
          status: 0,
        });
      } else {
        setSelectedCreator(null);
        setNewProjectTask({
          creatorId: "",
          projectId: projectTask?.project.id || "",
          name: "",
          estimatedTime: 0,
          description: "",
          status: 0,
        });
      }
    }
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setSelectedProject(null);
    setSelectedCreator(null);
    setSelectedProjectTask(null);
    setNewProjectTask({
      creatorId: "",
      projectId: "",
      name: "",
      estimatedTime: 0,
      description: "",
      status: 0,
    });
  };

  return {
    modalMode,
    isModalVisible,
    newProjectTask,
    selectedProjectTask,
    selectedProject,
    selectedCreator,
    showModal,
    hideModal,
    setNewProjectTask,
    setSelectedCreator,
    setSelectedProjectTask,
    setSelectedProject,
    isAdmin,
    loggedInUser,
  };
};

export default useProjectTasksModal;
