import { useState, useCallback } from "react";
import { Button, Form, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SearchInput from "../../../components/common/SearchInput";
import LoaderComponent from "../../../components/common/Loader";
import ProjectTasksTable from "./table/ProjectTasksTable";
import useProjectTasks from "../hooks/useProjectTasks";
import useProjectTasksModal from "../hooks/useProjectTasksModal";
import CustomModal from "../../../components/common/CustomModal";
import TextArea from "antd/es/input/TextArea";
import useProjects from "../../projects/hooks/useProjects";
import useUsers from "../../users/hooks/useUsers";
import { ModalModes } from "../../../types/modalModes";

const ProjectTaskComponent = () => {
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

  const { projects } = useProjects();

  const { users } = useUsers();

  const [filterQuery, setFilterQuery] = useState<string>("");

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
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal(null, null, ModalModes.CREATE)}
          style={{ height: "40px", display: "flex", alignItems: "center" }}
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
        onOk={handleSave}
        onCancel={hideModal}
      >
        {(modalMode === ModalModes.CREATE ||
          modalMode === ModalModes.UPDATE) && (
          <Form layout="vertical">
            <Form.Item label="Name">
              <Input
                placeholder="Name"
                value={
                  (modalMode === ModalModes.CREATE
                    ? newProjectTask?.name
                    : selectedProjectTask?.name) || ""
                }
                onChange={(e) =>
                  modalMode === ModalModes.CREATE
                    ? setNewProjectTask((prev) => ({
                        ...prev!,
                        name: e.target.value,
                      }))
                    : setSelectedProjectTask((prev) => ({
                        ...prev!,
                        name: e.target.value,
                      }))
                }
              />
            </Form.Item>
            <Form.Item label="Description">
              <TextArea
                placeholder="Description"
                value={
                  (modalMode === ModalModes.CREATE
                    ? newProjectTask?.description
                    : selectedProjectTask?.description) || ""
                }
                onChange={(e) =>
                  modalMode === ModalModes.CREATE
                    ? setNewProjectTask((prev) => ({
                        ...prev!,
                        description: e.target.value,
                      }))
                    : setSelectedProjectTask((prev) => ({
                        ...prev!,
                        description: e.target.value,
                      }))
                }
              />
            </Form.Item>
            <Form.Item label="Estimated Time">
              <Input
                placeholder="Estimated Time, minutes"
                type="number"
                maxLength={3}
                value={
                  (modalMode === ModalModes.CREATE
                    ? newProjectTask?.estimatedTime
                    : selectedProjectTask?.estimatedTime) || ""
                }
                onChange={(e) =>
                  modalMode === ModalModes.CREATE
                    ? setNewProjectTask((prev) => ({
                        ...prev!,
                        estimatedTime: Number(e.target.value),
                      }))
                    : setSelectedProjectTask((prev) => ({
                        ...prev!,
                        estimatedTime: Number(e.target.value),
                      }))
                }
              />
            </Form.Item>
            <Form.Item label="Project">
              <Select
                style={{ width: "100%" }}
                placeholder="Select Project"
                value={
                  modalMode === ModalModes.CREATE
                    ? newProjectTask?.projectId
                    : selectedProject?.id
                }
                onChange={(value) =>
                  modalMode === ModalModes.CREATE
                    ? setNewProjectTask((prev) => ({
                        ...prev!,
                        projectId: value,
                      }))
                    : setSelectedProject(
                        projects?.find((project) => project.id === value) ||
                          null
                      )
                }
                disabled={modalMode !== ModalModes.CREATE}
                loading={loading}
              >
                {modalMode === ModalModes.CREATE &&
                  projects?.map((project) => (
                    <Select.Option key={project.id} value={project.id}>
                      {project.name}
                    </Select.Option>
                  ))}
                {modalMode === ModalModes.UPDATE && selectedProject && (
                  <Select.Option
                    key={selectedProject?.id}
                    value={selectedProject?.id}
                  >
                    {selectedProject?.name}
                  </Select.Option>
                )}
              </Select>
            </Form.Item>
            {modalMode === ModalModes.UPDATE && selectedProjectTask && (
              <Form.Item label="Status">
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Status"
                  value={selectedProjectTask.status}
                  onChange={(value) =>
                    setSelectedProjectTask((prev) => ({
                      ...prev!,
                      status: value,
                    }))
                  }
                >
                  {projectTaskStatuses?.map((status) => (
                    <Select.Option key={status.id} value={status.id}>
                      {status.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </Form>
        )}
        {modalMode === ModalModes.DELETE && selectedProjectTask && (
          <p>Are you sure you want to delete this project task?</p>
        )}

        {modalMode === ModalModes.ADD_USER && (
          <Form layout="vertical">
            <Form.Item label="Project Task" required>
              <Select
                style={{ width: "100%" }}
                placeholder="Select Project Task"
                value={selectedProjectTask?.id}
                disabled
              >
                <Select.Option
                  key={selectedProjectTask?.id}
                  value={selectedProjectTask?.id}
                >
                  {selectedProjectTask?.name}
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="User" required>
              <Select
                style={{ width: "100%" }}
                placeholder="Select User"
                value={newUserTask?.userId}
                onChange={(value) =>
                  setNewUserTask((prev) => ({
                    ...prev!,
                    userId: value,
                  }))
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
          </Form>
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
