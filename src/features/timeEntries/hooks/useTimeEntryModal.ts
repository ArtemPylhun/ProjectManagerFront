import { useState } from "react";
import {
  TimeEntryInterface,
  TimeEntryCreateInterface,
} from "../interfaces/TimeEntryInterface";
import { UserInterface } from "../../users/interfaces/UserInterface";
import { ProjectInterface } from "../../projects/interfaces/ProjectInterface";
import { ProjectTaskInterface } from "../../projectTasks/interfaces/ProjectTaskInterface";

const useTimeEntryModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "delete" | "update">(
    "create"
  );
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

  const showModal = (
    timeEntry: TimeEntryInterface | null,
    mode: typeof modalMode
  ) => {
    setModalMode(mode);
    if (mode !== "create" && timeEntry) {
      setSelectedProject(timeEntry.project);
      setSelectedUser(timeEntry.user);
      setSelectedProjectTask(timeEntry.projectTask);
      setSelectedTimeEntry({ ...timeEntry });
    } else {
      setSelectedProject(null);
      setSelectedProjectTask(null);
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
    setIsModalVisible(true);
  };

  const hideModal = () => setIsModalVisible(false);

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
  };
};

export default useTimeEntryModal;
