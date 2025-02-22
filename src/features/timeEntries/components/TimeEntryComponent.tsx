import React, { useCallback, useState } from "react";
import { Button, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SearchInput from "../../../components/common/SearchInput";
import LoaderComponent from "../../../components/common/Loader";
import TimeEntriesTable from "./table/TimeEntriesTable";
import useTimeEntries from "../hooks/useTimeEntries";
import useTimeEntryModal from "../hooks/useTimeEntryModal";
import CustomModal from "../../../components/common/CustomModal";
import TimeEntryForm from "./forms/TimeEntryForm";
import useUsers from "../../users/hooks/useUsers";
import useProjects from "../../projects/hooks/useProjects";
import useProjectTasks from "../../projectTasks/hooks/useProjectTasks";
import dayjs from "dayjs";
import { ModalModes } from "../../../types/modalModes";

const TimeEntryComponent = () => {
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [form] = Form.useForm();

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

    try {
      await form.validateFields();

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
    } catch (error) {
      console.error("Validation failed:", error);
    }
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
        isDanger={modalMode === ModalModes.DELETE}
        okText={
          modalMode === ModalModes.DELETE
            ? "Delete"
            : modalMode === ModalModes.CREATE
            ? "Create"
            : "Update"
        }
      >
        {(modalMode === ModalModes.CREATE ||
          modalMode === ModalModes.UPDATE) && (
          <TimeEntryForm
            form={form}
            timeEntryData={
              modalMode === ModalModes.CREATE ? newTimeEntry : selectedTimeEntry
            }
            setTimeEntryData={
              modalMode === ModalModes.CREATE
                ? setNewTimeEntry
                : setSelectedTimeEntry
            }
            isCreateMode={modalMode === ModalModes.CREATE}
            users={users || []}
            projects={projects || []}
            projectTasks={projectTasks || []}
            selectedUser={selectedUser}
            selectedProject={selectedProject}
            selectedProjectTask={selectedProjectTask}
            setSelectedUser={setSelectedUser}
            setSelectedProject={setSelectedProject}
            setSelectedProjectTask={setSelectedProjectTask}
            loading={loading}
          />
        )}

        {modalMode === ModalModes.DELETE && selectedTimeEntry && (
          <p>Are you sure you want to delete this time entry?</p>
        )}
      </CustomModal>
    </div>
  );
};

export default TimeEntryComponent;
