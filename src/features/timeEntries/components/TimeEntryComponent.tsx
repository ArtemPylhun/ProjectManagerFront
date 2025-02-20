import React, { useCallback, useState } from "react";
import { Button, Form, Select, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import CustomModal from "../../../components/common/CustomModal";
import SearchInput from "../../../components/common/SearchInput";
import LoaderComponent from "../../../components/common/Loader";
import TimeEntriesTable from "./table/TimeEntriesTable";
import useTimeEntries from "../hooks/useTimeEntries";
import useTimeEntryModal from "../hooks/useTimeEntryModal";
import useUsers from "../../users/hooks/useUsers";
import useProjects from "../../projects/hooks/useProjects";
import useProjectTasks from "../../projectTasks/hooks/useProjectTasks";
import dayjs from "dayjs";
import { ModalModes } from "../../../types/modalModes";
const TimeEntryComponent = () => {
  const [filterQuery, setFilterQuery] = useState<string>("");

  const {
    timeEntries,
    loading,
    handleCreateTimeEntry,
    handleUpdateTimeEntry,
    handleDeleteTimeEntry,
  } = useTimeEntries();

  const {
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
  } = useTimeEntryModal();

  const { users } = useUsers();
  const { projects } = useProjects();
  const { projectTasks } = useProjectTasks();

  const handleFilterQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterQuery(event.target.value);
  };

  const filteredTimeEntries = timeEntries
    ? timeEntries.filter((timeEntry) => {
        return (
          timeEntry.description
            .toLowerCase()
            .includes(filterQuery.toLowerCase()) ||
          timeEntry.user.userName
            .toLowerCase()
            .includes(filterQuery.toLowerCase()) ||
          timeEntry.description
            .toLowerCase()
            .includes(filterQuery.toLowerCase()) ||
          timeEntry.project.name
            .toLowerCase()
            .includes(filterQuery.toLowerCase()) ||
          timeEntry.projectTask?.name
            .toLowerCase()
            .includes(filterQuery.toLowerCase())
        );
      })
    : [];

  const handleSave = useCallback(async () => {
    if (!modalMode) return;

    let result = false;
    if (modalMode === ModalModes.CREATE && newTimeEntry) {
      newTimeEntry.minutes = dayjs(newTimeEntry.endTime).diff(
        newTimeEntry.startTime,
        "minute"
      );
      result = await handleCreateTimeEntry(newTimeEntry);
    } else if (modalMode === ModalModes.UPDATE && selectedTimeEntry) {
      selectedTimeEntry.minutes = dayjs(selectedTimeEntry.endTime).diff(
        selectedTimeEntry.startTime,
        "minute"
      );
      result = await handleUpdateTimeEntry({
        ...selectedTimeEntry,
        userId: selectedUser!.id,
        projectId: selectedProject!.id,
        projectTaskId: selectedProjectTask!.id,
      });
    } else if (modalMode === ModalModes.DELETE && selectedTimeEntry) {
      result = await handleDeleteTimeEntry(selectedTimeEntry.id);
    }
    if (result) hideModal();
  }, [
    modalMode,
    newTimeEntry,
    selectedTimeEntry,
    selectedUser,
    selectedProject,
    selectedProjectTask,
    handleCreateTimeEntry,
    handleUpdateTimeEntry,
    handleDeleteTimeEntry,
    hideModal,
  ]);
  return (
    <div>
      <div className="projects-header">
        <SearchInput
          query={filterQuery}
          onQueryChange={handleFilterQueryChange}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal(null, ModalModes.CREATE)}
          style={{ height: "40px", display: "flex", alignItems: "center" }}
        >
          Create Time Entry
        </Button>
      </div>
      <LoaderComponent loading={loading}>
        <TimeEntriesTable
          timeEntries={filteredTimeEntries}
          users={users!}
          projects={projects!}
          projectTasks={projectTasks!}
          showModal={showModal}
        />
      </LoaderComponent>
      <CustomModal
        visible={isModalVisible}
        onCancel={hideModal}
        onOk={handleSave}
        title={
          modalMode === ModalModes.CREATE
            ? "Create Time Entry"
            : modalMode === ModalModes.UPDATE
            ? "Update Time Entry"
            : "Delete Time Entry"
        }
      >
        {(modalMode === ModalModes.CREATE ||
          modalMode === ModalModes.UPDATE) && (
          <Form layout="vertical">
            <Form.Item label="Description">
              <TextArea
                placeholder="Description"
                value={
                  (modalMode === ModalModes.CREATE
                    ? newTimeEntry?.description
                    : selectedTimeEntry?.description) || ""
                }
                onChange={(event) =>
                  modalMode === ModalModes.CREATE
                    ? setNewTimeEntry((prev) => ({
                        ...prev!,
                        description: event.target.value,
                      }))
                    : setSelectedTimeEntry((prev) => ({
                        ...prev!,
                        description: event.target.value,
                      }))
                }
              />
            </Form.Item>
            <Form.Item label="Start Time">
              <DatePicker
                showTime
                value={
                  modalMode === ModalModes.CREATE
                    ? newTimeEntry?.startTime
                      ? dayjs(newTimeEntry.startTime)
                      : null
                    : selectedTimeEntry?.startTime
                    ? dayjs(selectedTimeEntry.startTime)
                    : null
                }
                onChange={(value) => {
                  if (!value) return;

                  const newDate = value.toDate();
                  if (modalMode === ModalModes.CREATE) {
                    setNewTimeEntry((prev) =>
                      prev ? { ...prev, startTime: newDate } : prev
                    );
                  } else {
                    setSelectedTimeEntry((prev) =>
                      prev ? { ...prev, startTime: newDate } : prev
                    );
                  }
                }}
              />
            </Form.Item>

            <Form.Item label="End Time">
              <DatePicker
                showTime
                value={
                  modalMode === ModalModes.CREATE
                    ? newTimeEntry?.endTime
                      ? dayjs(newTimeEntry.endTime)
                      : null
                    : selectedTimeEntry?.endTime
                    ? dayjs(selectedTimeEntry.endTime)
                    : null
                }
                onChange={(value) => {
                  if (!value) return;

                  const newDate = value.toDate();
                  if (modalMode === ModalModes.CREATE) {
                    setNewTimeEntry((prev) =>
                      prev ? { ...prev, endTime: newDate } : prev
                    );
                  } else {
                    setSelectedTimeEntry((prev) =>
                      prev ? { ...prev, endTime: newDate } : prev
                    );
                  }
                }}
              />
            </Form.Item>
            <Form.Item label="User">
              <Select
                style={{ width: "100%" }}
                placeholder="Select User"
                value={
                  modalMode === ModalModes.CREATE
                    ? newTimeEntry?.userId
                    : selectedUser?.id
                }
                onChange={(value) =>
                  modalMode === ModalModes.CREATE
                    ? setNewTimeEntry((prev) => ({
                        ...prev!,
                        userId: value,
                      }))
                    : setSelectedUser(
                        users?.find((u) => u.id === value) || null
                      )
                }
                loading={loading}
              >
                {users?.map((user) => (
                  <Select.Option key={user.id} value={user.id}>
                    {user.userName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Project">
              <Select
                style={{ width: "100%" }}
                placeholder="Select Project"
                value={
                  modalMode === ModalModes.CREATE
                    ? newTimeEntry?.projectId
                    : selectedProject?.id
                }
                onChange={(value) =>
                  modalMode === ModalModes.CREATE
                    ? setNewTimeEntry((prev) => ({
                        ...prev!,
                        projectId: value,
                      }))
                    : setSelectedProject(
                        projects?.find((p) => p.id === value) || null
                      )
                }
                loading={loading}
              >
                {projects?.map((project) => (
                  <Select.Option key={project.id} value={project.id}>
                    {project.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Project Task">
              <Select
                style={{ width: "100%" }}
                placeholder="Select Project Task"
                value={
                  modalMode === ModalModes.CREATE
                    ? newTimeEntry?.projectTaskId
                    : selectedProjectTask?.id
                }
                onChange={(value) =>
                  modalMode === ModalModes.CREATE
                    ? setNewTimeEntry((prev) => ({
                        ...prev!,
                        projectTaskId: value,
                      }))
                    : setSelectedProjectTask(
                        projectTasks?.find((p) => p.id === value) || null
                      )
                }
                loading={loading}
              >
                {projectTasks
                  ?.filter((p) => {
                    if (!selectedProject) return true;
                    return p.project.id === selectedProject?.id;
                  })
                  .map((projectTask) => (
                    <Select.Option key={projectTask.id} value={projectTask.id}>
                      {projectTask.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Form>
        )}
        {modalMode === ModalModes.DELETE && selectedTimeEntry && (
          <p>Are you sure you want to delete this time entry?</p>
        )}
      </CustomModal>
    </div>
  );
};

export default TimeEntryComponent;
