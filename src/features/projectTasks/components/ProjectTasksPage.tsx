import React, { useCallback } from "react";
import { Button, Form, Space, Table, Tooltip } from "antd";
import { ModalModes } from "../../../types/modalModes";
import { ProjectInterface } from "../../projects/interfaces/ProjectInterface";
import { ProjectTaskInterface } from "../interfaces/ProjectTaskInterface";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { UserInterface } from "../../users/interfaces/UserInterface";
import CustomModal from "../../../components/common/CustomModal";
import ProjectTaskForm from "./forms/ProjectTaskForm";
import SearchInput from "../../../components/common/SearchInput";
import useProjectTasks from "../hooks/useProjectTasks";
import useProjectTasksModal from "../hooks/useProjectTasksModal";
import useProjects from "../../projects/hooks/useProjects";
import useUsers from "../../users/hooks/useUsers";
import dayjs from "dayjs";
import "../../../styles/client-styles/projects/projectsStyles.css";

const ProjectTasksPage: React.FC = () => {
  const [form] = Form.useForm();

  const { users } = useUsers(false);

  const {
    projectTasks,
    projectTaskStatuses,
    handleCreateProjectTask,
    handleDeleteProjectTask,
    handleUpdateProjectTask,
    loading,
    currentPage,
    pageSize,
    totalCount,
    handlePageChange,
    handleSearch,
    searchQuery,
  } = useProjectTasks(true);

  const {
    modalMode,
    isModalVisible,
    newProjectTask,
    selectedProjectTask,
    selectedProject,
    selectedCreator,
    setSelectedCreator,
    setNewProjectTask,
    setSelectedProjectTask,
    setSelectedProject,
    showModal,
    hideModal,
    isAdmin,
  } = useProjectTasksModal();

  const { projects } = useProjects(false);

  const handleFilterQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleSearch(event.target.value);
  };

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
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: Date) => dayjs(createdAt).format("DD/MM/YYYY HH:mm"),
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
      title: "Creator",
      dataIndex: "creator",
      key: "creator",
      render: (creator: UserInterface) => isAdmin && creator.userName,
      hidden: !isAdmin,
    },
    {
      title: "Actions",
      key: "actions",
      render: (projectTask: ProjectTaskInterface) => (
        <Space>
          <Button
            className="action-button"
            icon={<EditOutlined />}
            onClick={() => showModal(projectTask, ModalModes.UPDATE)}
          />
          {isAdmin && (
            <Button
              className="action-button danger"
              icon={<DeleteOutlined />}
              onClick={() => showModal(projectTask, ModalModes.DELETE)}
            />
          )}
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
        {((projects && projects.length > 0) || isAdmin) && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="create-project-button"
              onClick={() => showModal(null, ModalModes.CREATE)}
            >
              Add Task
            </Button>
          </div>
        )}

        <Table
          dataSource={projectTasks || []}
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
              : "Delete Task"
          }
          isDanger={modalMode === ModalModes.DELETE}
          okText={
            modalMode === ModalModes.CREATE
              ? "Create"
              : modalMode === ModalModes.UPDATE
              ? "Update"
              : "Delete"
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
              users={isAdmin ? users : []}
              projectTaskStatuses={projectTaskStatuses}
              projects={projects || []}
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              selectedCreator={selectedCreator}
              setSelectedCreator={setSelectedCreator}
              loading={loading}
            />
          )}
          {modalMode === ModalModes.UPDATE && selectedProjectTask && (
            <ProjectTaskForm
              form={form}
              users={isAdmin ? users : []}
              projectTaskData={selectedProjectTask}
              setProjectTaskData={setSelectedProjectTask}
              isCreateMode={false}
              projectTaskStatuses={projectTaskStatuses}
              projects={projects || []}
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
              selectedCreator={selectedCreator}
              setSelectedCreator={setSelectedCreator}
              loading={loading}
            />
          )}
          {modalMode === ModalModes.DELETE && selectedProjectTask && (
            <p>Are you sure you want to delete this task?</p>
          )}
        </CustomModal>
      </div>
    </>
  );
};

export default ProjectTasksPage;
