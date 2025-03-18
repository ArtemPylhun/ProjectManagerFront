import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Space, Form, Descriptions, Avatar, Tag, List } from "antd";
import { ProjectInterface } from "../interfaces/ProjectInterface";
import { ProjectUserInterface } from "../interfaces/ProjectUserInterface";
import { UserInterface } from "../../users/interfaces/UserInterface";
import { RoleInterface } from "../../roles/interfaces/RoleInterface";
import { ModalModes } from "../../../types/modalModes";
import CustomModal from "../../../components/common/CustomModal";
import ProjectForm from "./forms/ProjectForm";
import ProjectUserForm from "./forms/ProjectUserForm";
import useRoles from "../../roles/hooks/useRoles";
import useUsers from "../../users/hooks/useUsers";
import useProjects from "../hooks/useProjects";
import useProjectModal from "../hooks/useProjectModal";
import "../../../styles/client-styles/projects/projectsStyles.css";

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>() || { id: undefined };
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectInterface | null>(null);
  const [form] = Form.useForm();
  const [isUsersExpanded, setIsUsersExpanded] = useState(false);

  const { roles } = useRoles(true, false, false);
  const { users } = useUsers(false, id);
  const {
    projects: allProjects,
    loading: loading,
    handleUpdateProject,
    handleAddUserToProject,
    handleRemoveUserFromProject,
    fetchProjectById,
    isAdmin,
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
    if (!id) return;

    const fetchProject = async () => {
      const foundProject = allProjects?.find((p) => p.id === id);
      if (foundProject) {
        setProject(foundProject);
      } else {
        const project = await fetchProjectById(
          id,
          new AbortController().signal
        );
        if (project) {
          setProject(project);
        } else {
          console.warn("Project not found for ID:", id);
          setProject(null);
        }
      }
    };

    fetchProject();
  }, [allProjects, id, fetchProjectById]);

  if (loading || !project) {
    return <div className="loading">Loading project details...</div>;
  }

  const userMap = new Map<string, UserInterface>();
  const roleMap = new Map<string, RoleInterface>();
  const userRolesMap = new Map<
    string,
    { roleName: string; projectUserId: string }[]
  >();

  // Populate maps
  project.projectUsers?.forEach((pu: ProjectUserInterface) => {
    const user = users?.find((u) => u.id === pu.userId);
    if (user) userMap.set(pu.userId, user);
    const role = roles?.find((r) => r.id === pu.roleId);
    if (role) roleMap.set(pu.roleId, role);

    // Group roles by user
    const userId = pu.userId;
    const roleName = role?.name || "No Role";
    if (userId) {
      const rolesForUser = userRolesMap.get(userId) || [];
      rolesForUser.push({ roleName, projectUserId: pu.id });
      userRolesMap.set(userId, rolesForUser);
    }
  });

  const creator = project.creator
    ? users?.find((u) => u.id === project.creator.id) || {
        userName: project.creator.userName,
        id: project.creator.id,
      }
    : { userName: "Unknown Creator", id: "" };
  const client = project.client
    ? users?.find((u) => u.id === project.client.id) || {
        userName: project.client.userName,
        id: project.client.id,
      }
    : { userName: "Unknown Client", id: "" };

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

  const toggleUsers = () => {
    setIsUsersExpanded(!isUsersExpanded);
  };

  return (
    <div className="project-detail-page">
      <div className="project-detail-header">
        <div className="header-content">
          <h1>{project.name}</h1>
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
          <Button
            type="primary"
            className="expand-users-button"
            onClick={toggleUsers}
            style={{
              marginBottom: 0, // Remove margin to align with your design
              background: "rgba(115, 170, 238, 0.5)",
              border: "1px solid rgba(115, 170, 238, 0.7)",
              color: "#ffffff",
              borderRadius: "8px",
              padding: "8px 16px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              transition:
                "background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(82, 106, 183, 0.7)";
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 6px 15px rgba(0, 0, 0, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(115, 170, 238, 0.5)";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
            }}
          >
            {isUsersExpanded ? "Collapse Users" : "Expand Users"}
          </Button>
          {isUsersExpanded && (
            <List
              dataSource={Array.from(userRolesMap.entries())}
              renderItem={([userId, roles]) => {
                const user = userMap.get(userId) || {
                  userName: "Unknown User",
                };
                return (
                  <List.Item
                    style={{
                      padding: "12px 0",
                      background: "rgba(254, 254, 254, 0.15)",
                      borderRadius: "8px",
                      marginBottom: "12px",
                      marginTop: "12px", // Add space after the button when expanded
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      backdropFilter: "blur(10px)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-2px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size={30}
                          src={`https://ui-avatars.com/api/?name=${user.userName}`}
                        />
                      }
                      title={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <span className="user-name">{user.userName}</span>
                        </div>
                      }
                      description={
                        <Space
                          direction="vertical"
                          style={{ width: "100%", gap: "8px" }}
                        >
                          {roles.map((role, index) => (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                background: "rgba(184, 215, 251, 0.25)",
                                padding: "8px 12px",
                                marginRight: "20px",
                                borderRadius: "4px",
                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <Tag color="blue" style={{ margin: 0 }}>
                                {role.roleName}
                              </Tag>
                              {isAdmin && (
                                <Button
                                  danger
                                  size="small"
                                  style={{
                                    background: "rgba(255, 0, 0, 0.2)",
                                    borderColor: "#ff4d4f",
                                    color: "#ff4d4f",
                                    transition:
                                      "background 0.3s ease, transform 0.3s ease",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.background =
                                      "rgba(255, 0, 0, 0.4)")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                      "rgba(255, 0, 0, 0.2)")
                                  }
                                  onClick={() =>
                                    showModal(
                                      null,
                                      {
                                        id: role.projectUserId,
                                      } as ProjectUserInterface,
                                      ModalModes.REMOVE_USER
                                    )
                                  }
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          ))}
                        </Space>
                      }
                    />
                  </List.Item>
                );
              }}
              style={{ background: "transparent", padding: 0 }}
            />
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {project.createdAt
            ? new Date(project.createdAt).toLocaleString()
            : "N/A"}
        </Descriptions.Item>
      </Descriptions>
      {isAdmin && (
        <div style={{ marginTop: "10px" }}>
          <Space className="action-buttons">
            <Button
              type="primary"
              className="edit-button"
              onClick={() => showModal(project, null, ModalModes.UPDATE)}
            >
              Edit Project Info
            </Button>
            <Button
              type="primary"
              className="manage-users-button"
              onClick={() => showModal(project, null, ModalModes.ADD_USER)}
            >
              Add User
            </Button>
          </Space>
        </div>
      )}

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
            isUserCreator={true}
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
