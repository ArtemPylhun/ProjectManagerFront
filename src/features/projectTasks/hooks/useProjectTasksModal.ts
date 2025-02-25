import { useState } from "react";
import {
  ProjectTaskInterface,
  ProjectTaskCreateInterface,
} from "../interfaces/ProjectTaskInterface";
import { ProjectInterface } from "../../projects/interfaces/ProjectInterface";
import {
  UserTaskInterface,
  UserTaskCreateInterface,
} from "../interfaces/UserTaskInterface";
import { ModalMode, ModalModes } from "../../../types/modalModes";
const useProjectTasksModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(ModalModes.CREATE);

  const [selectedProjectTask, setSelectedProjectTask] =
    useState<ProjectTaskInterface | null>(null);

  const [selectedProject, setSelectedProject] =
    useState<ProjectInterface | null>(null);

  const [selectedUserTask, setSelectedUserTask] =
    useState<UserTaskInterface | null>(null);

  const [newProjectTask, setNewProjectTask] =
    useState<ProjectTaskCreateInterface>({
      projectId: "",
      name: "",
      estimatedTime: 0,
      description: "",
      status: 0,
    });

  const [newUserTask, setNewUserTask] = useState<UserTaskCreateInterface>({
    projectTaskId: "",
    userId: "",
  });

  const showModal = (
    projectTask: ProjectTaskInterface | null,
    userTask: UserTaskInterface | null,
    mode: ModalMode
  ) => {
    setModalMode(mode);
    if (mode !== ModalModes.CREATE && projectTask) {
      setSelectedProject({ ...projectTask.project });
      setSelectedProjectTask({ ...projectTask });
      setSelectedUserTask(userTask);
      if (mode === ModalModes.ADD_USER) {
        setNewUserTask((prev) => ({
          ...prev!,
          projectTaskId: projectTask.id,
        }));
      }
    } else if (mode === ModalModes.REMOVE_USER && userTask) {
      setSelectedUserTask(userTask);
    } else {
      setSelectedProject(null);
      setNewUserTask({ projectTaskId: projectTask?.id || "", userId: "" });
      setNewProjectTask({
        projectId: projectTask?.project.id || "",
        name: "",
        estimatedTime: 0,
        description: "",
        status: 0,
      });
    }
    setIsModalVisible(true);
  };

  const hideModal = () => setIsModalVisible(false);

  return {
    modalMode,
    isModalVisible,
    newProjectTask,
    newUserTask,
    selectedProjectTask,
    selectedProject,
    selectedUserTask,
    showModal,
    hideModal,
    setNewProjectTask,
    setNewUserTask,
    setSelectedUserTask,
    setSelectedProjectTask,
    setSelectedProject,
  };
};

export default useProjectTasksModal;
