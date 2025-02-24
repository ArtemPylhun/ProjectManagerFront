import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Space, Form, Select, Descriptions, Avatar, Tag } from "antd";
import { ProjectInterface } from "../../../projects/interfaces/ProjectInterface";
import { ProjectUserInterface } from "../../../projects/interfaces/ProjectUserInterface";
import { UserInterface } from "../../../users/interfaces/UserInterface";
import { RoleInterface } from "../../../roles/interfaces/RoleInterface";
import { ModalModes } from "../../../../types/modalModes";
import CustomModal from "../../../../components/common/CustomModal";
import ProjectForm from "../../../projects/components/forms/ProjectForm";
import ProjectUserForm from "../../../projects/components/forms/ProjectUserForm";
import useRoles from "../../../roles/hooks/useRoles";
import useUsers from "../../../users/hooks/useUsers";
import useProjects from "../../../projects/hooks/useProjects";
import useProjectModal from "../../../projects/hooks/useProjectModal";
import "../../../../styles/client-styles/projects/projectsStyles.css";

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>() || { id: undefined };
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectInterface | null>(null);
  const [form] = Form.useForm();

  const { roles } = useRoles(true, false);
  const { users } = useUsers();
  const {
    projects: allProjects,
    loading: loading,
    handleUpdateProject,
    handleAddUserToProject,
    handleRemoveUserFromProject,
  } = useProjects(true);

  const {
    modalMode,
    isModalVisible,
    selectedProject,
    selectedClient,
    selectedCreator,
    selectedProjectUser,
    newProjectUser,
    showModal,
    hideModal,
    setSelectedProject,
    setSelectedClient,
    setSelectedCreator,
    setNewProjectUser,
  } = useProjectModal();

  useEffect(() => {
    if (allProjects && id) {
      const foundProject = allProjects.find((p) => p.id === id);
      if (foundProject) {
        setProject(foundProject);
      }
    }
  }, [allProjects, id]);

  if (loading || !project) {
    return <div className="loading">Loading project details...</div>;
  }

  const userMap = new Map<string, UserInterface>();
  const roleMap = new Map<string, RoleInterface>();
  project.projectUsers?.forEach((pu: ProjectUserInterface) => {
    const user = users?.find((u) => u.id === pu.userId);
    if (user) userMap.set(pu.userId, user);
    const role = roles?.find((r) => r.id === pu.roleId);
    if (role) roleMap.set(pu.roleId, role);
  });

  const creator = userMap.get(project.creator?.id || "") || {
    userName: "Unknown Creator",
  };
  const client = userMap.get(project.client?.id || "") || {
    userName: "Unknown Client",
  };

  const handleSave = async () => {
    if (!modalMode || !id) return;

    try {
      await form.validateFields();

      let result = false;

      if (
        modalMode === ModalModes.UPDATE &&
        selectedProject &&
        selectedClient
      ) {
        result = await handleUpdateProject({
          ...selectedProject,
        });
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
  };

  return (
    <div className="project-detail-page">
      <div className="project-detail-header">
        <div className="header-content">
          <h1>{project.name}</h1>
          <Space className="action-buttons">
            <Button
              type="primary"
              className="edit-button"
              onClick={() => showModal(project, null, ModalModes.UPDATE)}
            >
              Edit Project
            </Button>
            <Button
              type="primary"
              className="manage-users-button"
              onClick={() => showModal(project, null, ModalModes.ADD_USER)}
            >
              Manage Users
            </Button>
          </Space>
        </div>
        <Button
          type="primary"
          className="back-button"
          onClick={() => navigate("/projects")}
        >
          Back to Projects
        </Button>
      </div>
      <Descriptions
        title="Project Details"
        bordered
        className="modern-descriptions single-column"
        layout="vertical"
        column={1}
      >
        <Descriptions.Item label="Description">
          {project.description}
        </Descriptions.Item>
        <Descriptions.Item label="Color">
          <div
            className="color-box"
            style={{ backgroundColor: project.colorHex || "#ffffff" }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Creator">
          <div className="user-role-item">
            <Avatar
              size={30}
              src={`https://ui-avatars.com/api/?name=${creator.userName}`}
            />
            <span className="user-name">{creator.userName}</span>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Client">
          <div className="user-role-item">
            <Avatar
              size={30}
              src={`https://ui-avatars.com/api/?name=${client.userName}`}
            />
            <span className="user-name">{client.userName}</span>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="Users">
          <Space direction="vertical" style={{ width: "100%" }}>
            {project.projectUsers?.map((projectUser: ProjectUserInterface) => {
              const user = userMap.get(projectUser.userId) || {
                userName: "Unknown User",
              };
              const roleName =
                roleMap.get(projectUser.roleId)?.name || "No Role";
              return (
                <div key={projectUser.userId} className="user-role-item">
                  <Avatar
                    size={30}
                    src={`https://ui-avatars.com/api/?name=${user.userName}`}
                  />
                  <span className="user-name">{user.userName}</span>
                  <Tag color="blue">{roleName}</Tag>
                  <Button
                    danger
                    size="small"
                    onClick={() =>
                      showModal(null, projectUser, ModalModes.REMOVE_USER)
                    }
                  >
                    Remove
                  </Button>
                </div>
              );
            })}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {project.createdAt
            ? new Date(project.createdAt).toLocaleString()
            : "N/A"}
        </Descriptions.Item>
      </Descriptions>

      <CustomModal
        visible={isModalVisible}
        title={
          modalMode === ModalModes.UPDATE
            ? "Edit Project"
            : modalMode === ModalModes.ADD_USER
            ? "Add User to Project"
            : modalMode === ModalModes.REMOVE_USER
            ? "Remove User from Project"
            : "Unknown Action"
        }
        isDanger={modalMode === ModalModes.REMOVE_USER}
        okText={
          modalMode === ModalModes.REMOVE_USER
            ? "Remove"
            : modalMode === ModalModes.UPDATE
            ? "Save"
            : "Add"
        }
        onOk={handleSave}
        onCancel={hideModal}
      >
        {modalMode === ModalModes.UPDATE && (
          <ProjectForm
            form={form}
            projectData={project}
            setProjectData={setSelectedProject}
            isCreateMode={false}
            users={users || []}
            selectedClient={selectedClient}
            selectedCreator={selectedCreator}
            setSelectedClient={setSelectedClient}
            setSelectedCreator={setSelectedCreator}
            loading={loading}
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

        {modalMode === ModalModes.REMOVE_USER && selectedProjectUser && (
          <p>Are you sure you want to remove this user from this project?</p>
        )}
      </CustomModal>
    </div>
  );
};

export default ProjectDetailPage;
