import { Button, Form, Space, Table, Tooltip } from "antd";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTimeEntries from "../../../timeEntries/hooks/useTimeEntries";
import useTimeEntryModal from "../../../timeEntries/hooks/useTimeEntryModal";
import useProjects from "../../../projects/hooks/useProjects";
import useProjectTasks from "../../../projectTasks/hooks/useProjectTasks";
import useUserId from "../../../../hooks/useUserId";
import { TimeEntryInterface } from "../../../timeEntries/interfaces/TimeEntryInterface";
import { ModalModes } from "../../../../types/modalModes";
import dayjs from "dayjs";
import { ProjectTaskInterface } from "../../../projectTasks/interfaces/ProjectTaskInterface";
import { ProjectInterface } from "../../../projects/interfaces/ProjectInterface";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import SearchInput from "../../../../components/common/SearchInput";
import CustomModal from "../../../../components/common/CustomModal";
import TimeEntryForm from "../../../timeEntries/components/forms/TimeEntryForm";
import useUsers from "../../../users/hooks/useUsers";

const TimeEntryUserPage: React.FC = () => {
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");

  const { users } = useUsers();

  const { projects } = useProjects(true);

  const { projectTasks } = useProjectTasks(true);

  const { timeEntries, handleCreateTimeEntry, handleDeleteTimeEntry, loading } =
    useTimeEntries();

  const {
    modalMode,
    isModalVisible,
    newTimeEntry,
    selectedTimeEntry,
    setNewTimeEntry,
    setSelectedTimeEntry,
    selectedProject,
    selectedProjectTask,
    selectedUser,
    setSelectedProject,
    setSelectedProjectTask,
    setSelectedUser,
    showModal,
    hideModal,
  } = useTimeEntryModal();

  const { userId } = useUserId();

  const handleFilterQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const filteredTimeEntries = timeEntries?.filter(
    (timeEntry: TimeEntryInterface) =>
      timeEntry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      timeEntry.project?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      timeEntry.projectTask?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const handleSave = useCallback(async () => {
    if (!modalMode) return;

    try {
      await form.validateFields();

      let result = false;

      if (
        modalMode === ModalModes.CREATE &&
        newTimeEntry &&
        selectedUser &&
        selectedProject
      ) {
        newTimeEntry.minutes = dayjs(newTimeEntry.endTime).diff(
          newTimeEntry.startTime,
          "minute"
        );
        result = await handleCreateTimeEntry({
          ...newTimeEntry,
          userId: userId || "",
          projectId: selectedProject.id,
          projectTaskId: selectedProjectTask?.id || "",
        });
      } else if (modalMode === ModalModes.DELETE) {
        result = await handleDeleteTimeEntry(selectedTimeEntry?.id || "");
      }
      if (result) hideModal();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  }, [
    modalMode,
    newTimeEntry,
    selectedProject,
    selectedProjectTask,
    selectedUser,
    handleCreateTimeEntry,
    handleDeleteTimeEntry,
    hideModal,
  ]);

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description: string) => {
        const maxLength = 20;
        const truncated =
          description.length > maxLength
            ? `${description.substring(0, maxLength)}...`
            : description;
        return (
          <Tooltip title={description} placement="top">
            <div className="description">{truncated}</div>
          </Tooltip>
        );
      },
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (startTime: Date) =>
        dayjs(startTime).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (endTime: Date) => dayjs(endTime).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Minutes",
      dataIndex: "minutes",
      key: "minutes",
    },

    {
      title: "Project",
      dataIndex: "project",
      key: "project",
      render: (project: ProjectInterface) => project.name,
    },
    {
      title: "Project Task",
      dataIndex: "projectTask",
      key: "projectTask",
      render: (projectTask: ProjectTaskInterface) => projectTask.name,
    },
    {
      title: "Actions",
      key: "actions",
      render: (timeEntry: TimeEntryInterface) => (
        <Space>
          <Button
            className="action-button danger"
            icon={<DeleteOutlined />}
            onClick={() => showModal(timeEntry, ModalModes.DELETE)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="projects-page">
        <div className="projects-header">
          <h1>My Time Entries</h1>
          <SearchInput
            query={searchQuery}
            onQueryChange={handleFilterQueryChange}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="create-project-button"
            onClick={() => showModal(null, ModalModes.CREATE)}
          >
            Create Time Entry
          </Button>
        </div>
        <Table
          dataSource={filteredTimeEntries}
          columns={columns}
          rowKey="id"
          className="modern-table"
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: "No projects found." }}
        />
      </div>
      <CustomModal
        visible={isModalVisible}
        title={
          modalMode === ModalModes.CREATE
            ? "Create Time Entry"
            : "Delete Time Entry"
        }
        isDanger={modalMode === ModalModes.DELETE}
        okText={modalMode === ModalModes.CREATE ? "Create" : "Delete"}
        onOk={handleSave}
        onCancel={hideModal}
      >
        {modalMode === ModalModes.CREATE && (
          <TimeEntryForm
            form={form}
            timeEntryData={{
              ...newTimeEntry,
              user: users?.find((x) => x.id === userId) || "",
              userId: userId || "",
            }}
            setTimeEntryData={setNewTimeEntry}
            isCreateMode={true}
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
            isUserCreator={true}
          />
        )}
        {modalMode === ModalModes.DELETE && (
          <p>Are you sure you want to delete this time entry?</p>
        )}
      </CustomModal>
    </>
  );
};

export default TimeEntryUserPage;
