import { useState, useCallback } from "react";
import { Button, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SearchInput from "../../../components/common/SearchInput";
import LoaderComponent from "../../../components/common/Loader";
import ProjectTasksTable from "./table/ProjectTasksTable";
import useProjectTasks from "../hooks/useProjectTasks";
import useProjectTasksModal from "../hooks/useProjectTasksModal";
import CustomModal from "../../../components/common/CustomModal";
import ProjectTaskForm from "./forms/ProjectTaskForm";
import ProjectTaskUserForm from "./forms/ProjectTaskUserForm";
import useProjects from "../../projects/hooks/useProjects";
import useUsers from "../../users/hooks/useUsers";
import { ModalModes } from "../../../types/modalModes";

const ProjectTaskComponent = () => {
  const [form] = Form.useForm();
  const [filterQuery, setFilterQuery] = useState<string>("");

  const {
    projectTasks,
    projectTaskStatuses,
    loading,
    handleDeleteProjectTask,
    handleCreateProjectTask,
    handleUpdateProjectTask,
    handleAddUserToProjectTask,
    handleRemoveUserFromProjectTask,
  } = useProjectTasks();

  const {
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
    setSelectedProjectTask,
    setSelectedProject,
    setNewUserTask,
  } = useProjectTasksModal();

  const { projects } = useProjects(false);
  const { users } = useUsers();

  const handleFilterQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterQuery(event.target.value);
  };

  const filteredProjectTasks = projectTasks?.filter((projectTask) => {
    return projectTask.name.toLowerCase().includes(filterQuery.toLowerCase());
  });

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
    selectedProjectTask,
    selectedProject,
    handleCreateProjectTask,
    handleUpdateProjectTask,
    handleDeleteProjectTask,
    handleAddUserToProjectTask,
    handleRemoveUserFromProjectTask,
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
          className="create-button"
          icon={<PlusOutlined />}
          onClick={() => showModal(null, null, ModalModes.CREATE)}
        >
          Create Project Task
        </Button>
      </div>
      <LoaderComponent loading={loading}>
        <ProjectTasksTable
          projectTaskStatuses={projectTaskStatuses}
          projectTasks={filteredProjectTasks}
          users={users!}
          showModal={showModal}
        />
      </LoaderComponent>

      <CustomModal
        visible={isModalVisible}
        title={
          modalMode === ModalModes.CREATE
            ? "Create Project Task"
            : modalMode === ModalModes.UPDATE
            ? "Update Project Task"
            : modalMode === ModalModes.ADD_USER
            ? "Add User to Project Task"
            : modalMode === ModalModes.REMOVE_USER
            ? "Remove User from Project Task"
            : "Delete Project Task"
        }
        isDanger={
          modalMode === ModalModes.DELETE ||
          modalMode === ModalModes.REMOVE_USER
        }
        okText={
          modalMode === ModalModes.DELETE ||
          modalMode === ModalModes.REMOVE_USER
            ? "Delete"
            : modalMode === ModalModes.CREATE ||
              modalMode === ModalModes.ADD_USER
            ? "Create"
            : "Update"
        }
        onOk={handleSave}
        onCancel={hideModal}
      >
        {(modalMode === ModalModes.CREATE ||
          modalMode === ModalModes.UPDATE) && (
          <ProjectTaskForm
            form={form}
            projectTaskData={
              modalMode === ModalModes.CREATE
                ? newProjectTask
                : selectedProjectTask
            }
            setProjectTaskData={
              modalMode === ModalModes.CREATE
                ? setNewProjectTask
                : setSelectedProjectTask
            }
            isCreateMode={modalMode === ModalModes.CREATE}
            projects={projects || []}
            projectTaskStatuses={projectTaskStatuses}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            loading={loading}
          />
        )}

        {modalMode === ModalModes.ADD_USER && (
          <ProjectTaskUserForm
            form={form}
            userTaskData={newUserTask}
            setUserTaskData={setNewUserTask}
            selectedProjectTask={selectedProjectTask}
            users={users || []}
            loading={loading}
          />
        )}

        {modalMode === ModalModes.DELETE && selectedProjectTask && (
          <p>Are you sure you want to delete this project task?</p>
        )}

        {modalMode === ModalModes.REMOVE_USER && selectedUserTask && (
          <p>
            Are you sure you want to remove this user from this project task?
          </p>
        )}
      </CustomModal>
    </div>
  );
};

export default ProjectTaskComponent;
