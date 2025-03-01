import { useEffect, useState } from "react";
import {
  TimeEntryInterface,
  TimeEntryCreateInterface,
} from "../interfaces/TimeEntryInterface";
import { UserInterface } from "../../users/interfaces/UserInterface";
import { ProjectInterface } from "../../projects/interfaces/ProjectInterface";
import { ProjectTaskInterface } from "../../projectTasks/interfaces/ProjectTaskInterface";
import { ModalMode, ModalModes } from "../../../types/modalModes";
import useUserId from "../../../hooks/useUserId";

const useTimeEntryModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>(ModalModes.CREATE);
  const { isAdmin, userId, loggedInUser } = useUserId();

  const [selectedTimeEntry, setSelectedTimeEntry] =
    useState<TimeEntryInterface | null>(null);
  const [newTimeEntry, setNewTimeEntry] = useState<TimeEntryCreateInterface>({
    description: "",
    startTime: new Date(),
    endTime: new Date(),
    minutes: 0,
    userId: "",
    projectId: "",
    projectTaskId: "",
  });

  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
  const [selectedProject, setSelectedProject] =
    useState<ProjectInterface | null>(null);
  const [selectedProjectTask, setSelectedProjectTask] =
    useState<ProjectTaskInterface | null>(null);

  useEffect(() => {
    if (!isAdmin && !loggedInUser) {
      return;
    }
    if (!isAdmin && loggedInUser) {
      setSelectedUser(loggedInUser);
      if (modalMode === ModalModes.CREATE) {
        setNewTimeEntry((prev) => ({
          ...prev,
          userId: loggedInUser.id,
        }));
      }
    }
  }, [isAdmin, loggedInUser, modalMode]);

  const showModal = (timeEntry: TimeEntryInterface | null, mode: ModalMode) => {
    setModalMode(mode);
    if (mode !== ModalModes.CREATE && timeEntry) {
      setSelectedTimeEntry({ ...timeEntry });
      setSelectedUser({ ...timeEntry.user });
      setSelectedProject({ ...timeEntry.project });
      setSelectedProjectTask({ ...timeEntry.projectTask });
    } else {
      setSelectedTimeEntry(null);
      setSelectedProject(null);
      setSelectedProjectTask(null);
      if (!isAdmin && loggedInUser) {
        setSelectedUser(loggedInUser);
        setNewTimeEntry({
          description: "",
          startTime: new Date(),
          endTime: new Date(),
          minutes: 0,
          userId: loggedInUser.id,
          projectId: "",
          projectTaskId: "",
        });
      } else {
        setSelectedUser(null);
        setNewTimeEntry({
          description: "",
          startTime: new Date(),
          endTime: new Date(),
          minutes: 0,
          userId: "",
          projectId: "",
          projectTaskId: "",
        });
      }
    }
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setSelectedTimeEntry(null);
    setSelectedProject(null);
    setSelectedProjectTask(null);
    setSelectedUser(null);
    setNewTimeEntry({
      description: "",
      startTime: new Date(),
      endTime: new Date(),
      minutes: 0,
      userId: isAdmin ? "" : loggedInUser?.id || "",
      projectId: "",
      projectTaskId: "",
    });
  };

  return {
    modalMode,
    isModalVisible,
    newTimeEntry,
    selectedTimeEntry,
    selectedUser,
    selectedProject,
    selectedProjectTask,
    showModal,
    hideModal,
    setNewTimeEntry,
    setSelectedTimeEntry,
    setSelectedUser,
    setSelectedProject,
    setSelectedProjectTask,
    isAdmin,
    userId,
  };
};

export default useTimeEntryModal;
