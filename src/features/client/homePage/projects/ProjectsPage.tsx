import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Space, Form } from "antd";
import { ProjectInterface } from "../../../projects/interfaces/ProjectInterface";
import SearchInput from "../../../../components/common/SearchInput";
import useProjects from "../../../projects/hooks/useProjects";
import "../../../../styles/client-styles/projects/projectsStyles.css";
import useProjectModal from "../../../projects/hooks/useProjectModal";
import CustomModal from "../../../../components/common/CustomModal";
import { ModalModes } from "../../../../types/modalModes";
import ProjectForm from "../../../projects/components/forms/ProjectForm";
import useUsers from "../../../users/hooks/useUsers";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import useUserId from "../../../../hooks/useUserId";

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState("");
  const { users } = useUsers();
  const { projects, handleCreateProject, handleDeleteProject, loading } =
    useProjects(true);

  const {
    modalMode,
    isModalVisible,
    newProject,
    selectedClient,
    selectedCreator,
    selectedProject,
    setSelectedClient,
    setSelectedCreator,
    showModal,
    hideModal,
    setNewProject,
  } = useProjectModal();

  const { userId } = useUserId();

  const handleFilterQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const filteredProjects = projects?.filter(
    (project: ProjectInterface) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      } else if (modalMode === ModalModes.DELETE && selectedProject) {
        result = await handleDeleteProject(selectedProject.id);
      }

      if (result) hideModal();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  }, [
    modalMode,
    newProject,
    selectedClient,
    selectedCreator,
    handleCreateProject,
    handleDeleteProject,
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
    },
    {
      title: "Color",
      dataIndex: "colorHex",
      key: "colorHex",
      render: (colorHex: string) => (
        <div
          className="color-box"
          style={{ backgroundColor: colorHex || "#ffffff" }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: ProjectInterface) => (
        <Space>
          <Button
            type="link"
            className="view-detail-button"
            onClick={() => navigate(`/projects/${record.id}`)}
          >
            View Details
          </Button>
          {userId === record.creator.id && (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => showModal(record, null, ModalModes.DELETE)}
            >
              Delete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="projects-page">
        <div className="projects-header">
          <h1>My Projects</h1>
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
            Create Project
          </Button>
        </div>
        <Table
          dataSource={filteredProjects}
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
          modalMode === ModalModes.CREATE ? "Create Project" : "Delete Proeject"
        }
        isDanger={modalMode === ModalModes.DELETE}
        okText={modalMode === ModalModes.CREATE ? "Create" : "Delete"}
        onOk={handleSave}
        onCancel={hideModal}
      >
        {modalMode === ModalModes.CREATE && (
          <ProjectForm
            form={form}
            projectData={{
              ...newProject,
              creator: users?.find((x) => x.id === userId) || "",
              creatorId: userId || "",
            }}
            setProjectData={setNewProject}
            isCreateMode
            users={users || []}
            selectedClient={selectedClient}
            selectedCreator={selectedCreator}
            setSelectedClient={setSelectedClient}
            setSelectedCreator={setSelectedCreator}
            loading={loading}
            isUserCreator={true}
          />
        )}
        {modalMode === ModalModes.DELETE && selectedProject && (
          <p>Are you sure you want to delete this project?</p>
        )}
      </CustomModal>
    </>
  );
};

export default ProjectsPage;
