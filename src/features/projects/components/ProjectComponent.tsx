import { useState, useCallback } from "react";
import { Button, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ModalModes } from "../../../types/modalModes";
import SearchInput from "../../../components/common/SearchInput";
import LoaderComponent from "../../../components/common/Loader";
import ProjectsTable from "./table/ProjectsTable";
import CustomModal from "../../../components/common/CustomModal";
import useProjects from "../hooks/useProjects";
import useProjectModal from "../hooks/useProjectModal";
import useUsers from "../../users/hooks/useUsers";
import useRoles from "../../roles/hooks/useRoles";
import ProjectForm from "./forms/ProjectForm";
import ProjectUserForm from "./forms/ProjectUserForm";

import "../../../styles/styles.css";

const ProjectComponent = () => {
  const [form] = Form.useForm();
  const [filterQuery, setFilterQuery] = useState<string>("");

  const {
    projects,
    loading,
    handleDeleteProject,
    handleCreateProject,
    handleUpdateProject,
    handleAddUserToProject,
    handleRemoveUserFromProject,
    currentPage,
    pageSize,
    totalCount,
    handlePageChange,
  } = useProjects(false, true);

  const {
    modalMode,
    isModalVisible,
    selectedProject,
    selectedClient,
    selectedCreator,
    selectedProjectUser,
    newProject,
    newProjectUser,
    showModal,
    hideModal,
    setNewProject,
    setSelectedProject,
    setSelectedClient,
    setSelectedCreator,
    setNewProjectUser,
  } = useProjectModal();

  const { users } = useUsers();
  const { roles } = useRoles(true, false);

  const handleFilterQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterQuery(event.target.value);
  };

  const filteredProjects = projects?.filter((project) => {
    return project.name.toLowerCase().includes(filterQuery.toLowerCase());
  });

  const handleSave = useCallback(async () => {
    if (!modalMode) return;

    try {
      await form.validateFields();

      let result = false;

      if (
        modalMode === ModalModes.CREATE &&
        newProject &&
        selectedClient &&
        selectedCreator
      ) {
        result = await handleCreateProject({
          ...newProject,
          clientId: selectedClient.id,
          creatorId: selectedCreator.id,
        });
      } else if (
        modalMode === ModalModes.UPDATE &&
        selectedProject &&
        selectedClient
      ) {
        result = await handleUpdateProject({
          ...selectedProject,
        });
      } else if (modalMode === ModalModes.DELETE && selectedProject) {
        result = await handleDeleteProject(selectedProject.id);
      } else if (
        modalMode === ModalModes.ADD_USER &&
        newProjectUser &&
        selectedProject
      ) {
        result = await handleAddUserToProject({
          ...newProjectUser,
          projectId: selectedProject.id,
        });
      } else if (modalMode === ModalModes.REMOVE_USER && selectedProjectUser) {
        result = await handleRemoveUserFromProject(selectedProjectUser.id);
      }

      if (result) hideModal();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  }, [
    modalMode,
    newProject,
    selectedProject,
    selectedClient,
    selectedCreator,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
    handleAddUserToProject,
    handleRemoveUserFromProject,
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
          icon={<PlusOutlined />}
          onClick={() => showModal(null, null, ModalModes.CREATE)}
          className="create-button"
        >
          Create Project
        </Button>
      </div>

      <LoaderComponent loading={loading}>
        <ProjectsTable
          projects={filteredProjects}
          users={users!}
          roles={roles!}
          showModal={showModal}
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={totalCount}
          handlePageChange={handlePageChange}
        />
      </LoaderComponent>

      <CustomModal
        visible={isModalVisible}
        title={
          modalMode === ModalModes.CREATE
            ? "Create New Project"
            : modalMode === ModalModes.UPDATE
            ? "Update Project"
            : modalMode === ModalModes.ADD_USER
            ? "Add User to Project"
            : modalMode === ModalModes.REMOVE_USER
            ? "Remove User from Project"
            : "Delete Project"
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
          <ProjectForm
            form={form}
            projectData={
              modalMode === ModalModes.CREATE ? newProject : selectedProject
            }
            setProjectData={
              modalMode === ModalModes.CREATE
                ? setNewProject
                : setSelectedProject
            }
            isCreateMode={modalMode === ModalModes.CREATE}
            users={users || []}
            selectedClient={selectedClient}
            selectedCreator={selectedCreator}
            setSelectedClient={setSelectedClient}
            setSelectedCreator={setSelectedCreator}
            loading={loading}
            isUserCreator={false}
          />
        )}

        {modalMode === ModalModes.ADD_USER && (
          <ProjectUserForm
            form={form}
            projectUserData={newProjectUser}
            setProjectUserData={setNewProjectUser}
            selectedProject={selectedProject}
            users={users || []}
            roles={roles || []}
            loading={loading}
          />
        )}

        {modalMode === ModalModes.DELETE && selectedProject && (
          <p>Are you sure you want to delete this project?</p>
        )}

        {modalMode === ModalModes.REMOVE_USER && selectedProjectUser && (
          <p>Are you sure you want to remove this user from this project?</p>
        )}
      </CustomModal>
    </div>
  );
};

export default ProjectComponent;
