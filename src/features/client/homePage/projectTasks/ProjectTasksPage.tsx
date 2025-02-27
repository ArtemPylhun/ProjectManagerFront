import React, { useCallback, useState } from "react";
import { Avatar, Button, Form, Space, Table, Tooltip } from "antd";
import { ModalModes } from "../../../../types/modalModes";
import { ProjectInterface } from "../../../projects/interfaces/ProjectInterface";
import { UserTaskInterface } from "../../../projectTasks/interfaces/UserTaskInterface";
import { ProjectTaskInterface } from "../../../projectTasks/interfaces/ProjectTaskInterface";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import CustomModal from "../../../../components/common/CustomModal";
import ProjectTaskUserForm from "../../../projectTasks/components/forms/ProjectTaskUserForm";
import ProjectTaskForm from "../../../projectTasks/components/forms/ProjectTaskForm";
import SearchInput from "../../../../components/common/SearchInput";
import useProjectTasks from "../../../projectTasks/hooks/useProjectTasks";
import useUsers from "../../../users/hooks/useUsers";
import useProjectTasksModal from "../../../projectTasks/hooks/useProjectTasksModal";
import useProjects from "../../../projects/hooks/useProjects";
import "../../../../styles/client-styles/projects/projectsStyles.css";

const ProjectTasksPage: React.FC = () => {
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");

  const { users } = useUsers();
  const { projects } = useProjects(true, false);

  const {
    projectTasks,
    projectTaskStatuses,
    handleCreateProjectTask,
    handleDeleteProjectTask,
    handleAddUserToProjectTask,
    handleRemoveUserFromProjectTask,
    handleUpdateProjectTask,
    loading,
    currentPage,
    pageSize,
    totalCount,
    handlePageChange,
  } = useProjectTasks(true, true);

  const {
    modalMode,
    isModalVisible,
    newProjectTask,
    selectedProjectTask,
    selectedProject,
    newUserTask,
    selectedUserTask,
    setNewProjectTask,
    setSelectedProjectTask,
    setSelectedProject,
    showModal,
    hideModal,
    setNewUserTask,
  } = useProjectTasksModal();

  const handleFilterQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const filteredProjectTasks = projectTasks
    ? projectTasks.filter((projectTask) => {
        const projectTaskStatus = projectTaskStatuses?.find(
          (s) => s.id === projectTask.status
        );
        return (
          projectTask.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          projectTask.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (projectTaskStatus &&
            projectTaskStatus.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
        );
      })
    : [];

  const handleSave = useCallback(async () => {
    if (!modalMode) return;

    try {
      await form.validateFields();

      let result = false;

      if (modalMode === ModalModes.CREATE && newProjectTask) {
        result = await handleCreateProjectTask({
          ...newProjectTask,
          projectId: newProjectTask.projectId,
        });
      } else if (
        modalMode === ModalModes.UPDATE &&
        selectedProjectTask &&
        selectedProject
      ) {
        result = await handleUpdateProjectTask({
          ...selectedProjectTask,
          projectId: selectedProject.id,
        });
      } else if (modalMode === ModalModes.DELETE && selectedProjectTask) {
        result = await handleDeleteProjectTask(selectedProjectTask.id);
      } else if (
        modalMode === ModalModes.ADD_USER &&
        newUserTask &&
        selectedProjectTask
      ) {
        result = await handleAddUserToProjectTask({
          ...newUserTask,
          projectTaskId: selectedProjectTask.id,
        });
      } else if (modalMode === ModalModes.REMOVE_USER && selectedUserTask) {
        result = await handleRemoveUserFromProjectTask(selectedUserTask.id);
      }

      if (result) hideModal();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  }, [
    modalMode,
    newProjectTask,
    selectedProject,
    handleCreateProjectTask,
    handleDeleteProjectTask,
    handleAddUserToProjectTask,
    handleRemoveUserFromProjectTask,
    handleUpdateProjectTask,
    hideModal,
  ]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
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
      title: "Estimated Time",
      dataIndex: "estimatedTime",
      key: "estimatedTime",
    },
    {
      title: "Project",
      dataIndex: "project",
      key: "project",
      render: (project: ProjectInterface) => project.name,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) =>
        projectTaskStatuses?.find((s) => s.id === status)?.name,
    },
    {
      title: "Users",
      dataIndex: "usersTask",
      key: "usersTask",
      render: (
        usersTask: UserTaskInterface[],
        record: ProjectTaskInterface
      ) => (
        <Space direction="vertical" style={{ width: "100%" }}>
          {usersTask.map((userTask) => {
            const user = users?.find((user) => user.id === userTask.userId);
            if (!user) return null;

            return (
              <div key={user.id} className="user-role-item">
                <Avatar
                  size={30}
                  src={`https://ui-avatars.com/api/?name=${user.userName}`}
                />
                <span className="user-name">{user.userName}</span>
                <Button
                  danger
                  size="small"
                  onClick={() =>
                    showModal(null, userTask, ModalModes.REMOVE_USER)
                  }
                >
                  Remove
                </Button>
              </div>
            );
          })}
          <Button
            type="dashed"
            size="small"
            onClick={() => showModal(record, null, ModalModes.ADD_USER)}
          >
            + Add User
          </Button>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (projectTask: ProjectTaskInterface) => (
        <Space>
          <Button
            className="action-button"
            icon={<EditOutlined />}
            onClick={() => showModal(projectTask, null, ModalModes.UPDATE)}
          />
          <Button
            className="action-button danger"
            icon={<DeleteOutlined />}
            onClick={() => showModal(projectTask, null, ModalModes.DELETE)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="projects-page">
        <div className="projects-header">
          <h1>Tasks</h1>
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
            onClick={() => showModal(null, null, ModalModes.CREATE)}
          >
            Add Task
          </Button>
        </div>

        <Table
          dataSource={filteredProjectTasks}
          columns={columns}
          rowKey="id"
          className="modern-table"
          pagination={{
            current: currentPage,
            pageSize,
            total: totalCount,
            onChange: handlePageChange,
          }}
          locale={{ emptyText: "No tasks found for this project." }}
          loading={loading}
        />
        <CustomModal
          visible={isModalVisible}
          title={
            modalMode === ModalModes.CREATE
              ? "Create Task"
              : modalMode === ModalModes.UPDATE
              ? "Update Task"
              : modalMode === ModalModes.DELETE
              ? "Delete Task"
              : modalMode === ModalModes.ADD_USER
              ? "Add User to Task"
              : modalMode === ModalModes.REMOVE_USER
              ? "Remove User from Task"
              : "Unknown Action"
          }
          isDanger={
            modalMode === ModalModes.DELETE ||
            modalMode === ModalModes.REMOVE_USER
          }
          okText={
            modalMode === ModalModes.CREATE
              ? "Create"
              : modalMode === ModalModes.UPDATE
              ? "Update"
              : modalMode === ModalModes.DELETE
              ? "Delete"
              : modalMode === ModalModes.ADD_USER
              ? "Add"
              : modalMode === ModalModes.REMOVE_USER
              ? "Remove"
              : "OK"
          }
          onOk={handleSave}
          onCancel={hideModal}
        >
          {modalMode === ModalModes.CREATE && (
            <ProjectTaskForm
              form={form}
              projectTaskData={newProjectTask}
              setProjectTaskData={setNewProjectTask}
              isCreateMode={true}
              projectTaskStatuses={projectTaskStatuses}
              projects={projects || []}
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              loading={loading}
            />
          )}
          {modalMode === ModalModes.UPDATE && selectedProjectTask && (
            <ProjectTaskForm
              form={form}
              projectTaskData={selectedProjectTask}
              setProjectTaskData={setSelectedProjectTask}
              isCreateMode={false}
              projectTaskStatuses={projectTaskStatuses}
              projects={projects || []}
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              loading={loading}
            />
          )}
          {modalMode === ModalModes.DELETE && selectedProjectTask && (
            <p>Are you sure you want to delete this task?</p>
          )}
          {modalMode === ModalModes.ADD_USER && selectedProjectTask && (
            <ProjectTaskUserForm
              form={form}
              userTaskData={newUserTask}
              setUserTaskData={setNewUserTask}
              selectedProjectTask={selectedProjectTask}
              users={users || []}
              loading={loading}
            />
          )}
          {modalMode === ModalModes.REMOVE_USER && selectedUserTask && (
            <p>
              Are you sure you want to remove this user from this project task?
            </p>
          )}
        </CustomModal>
      </div>
    </>
  );
};

export default ProjectTasksPage;
