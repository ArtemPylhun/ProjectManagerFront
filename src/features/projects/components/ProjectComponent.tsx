import { useState, useCallback } from "react";
import { Button, Form, Input, ColorPicker, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SearchInput from "../../../components/common/SearchInput";
import LoaderComponent from "../../../components/common/Loader";
import ProjectsTable from "./table/ProjectsTable";
import CustomModal from "../../../components/common/CustomModal";
import useProjects from "../hooks/useProjects";
import useProjectModal from "../hooks/useProjectModal";
import useUsers from "../../users/hooks/useUsers";
import "./table/ProjectsTable.css";

const { TextArea } = Input;

const ProjectComponent = () => {
  const {
    projects,
    loading,
    handleDeleteProject,
    handleCreateProject,
    handleUpdateProject,
  } = useProjects();

  const {
    modalMode,
    isModalVisible,
    selectedProject,
    selectedClient,
    selectedCreator,
    newProject,
    showModal,
    hideModal,
    setNewProject,
    setSelectedProject,
    setSelectedClient,
    setSelectedCreator,
  } = useProjectModal();

  const { users } = useUsers();

  const [filterQuery, setFilterQuery] = useState<string>("");

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

    let result = false;

    if (
      modalMode === "create" &&
      newProject &&
      selectedClient &&
      selectedCreator
    ) {
      result = await handleCreateProject({
        ...newProject,
        clientId: selectedClient.id,
        creatorId: selectedCreator.id,
      });
    } else if (modalMode === "update" && selectedProject && selectedClient) {
      result = await handleUpdateProject({
        ...selectedProject,
        clientId: selectedClient.id,
      });
    } else if (modalMode === "delete" && selectedProject) {
      result = await handleDeleteProject(selectedProject.id);
    }

    if (result) hideModal();
  }, [
    modalMode,
    newProject,
    selectedProject,
    selectedClient,
    selectedCreator,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
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
          onClick={() => showModal(null, "create")}
          style={{ height: "40px", display: "flex", alignItems: "center" }}
        >
          Create Project
        </Button>
      </div>

      <LoaderComponent loading={loading}>
        <ProjectsTable projects={filteredProjects} showModal={showModal} />
      </LoaderComponent>

      <CustomModal
        visible={isModalVisible}
        title={
          modalMode === "create"
            ? "Create New Project"
            : modalMode === "update"
            ? "Update Project"
            : "Delete Project"
        }
        onOk={handleSave}
        onCancel={hideModal}
      >
        {(modalMode === "create" || modalMode === "update") && (
          <Form layout="vertical">
            <Form.Item label="Name required" required>
              <Input
                placeholder="Name"
                value={
                  (modalMode === "create"
                    ? newProject?.name
                    : selectedProject?.name) || ""
                }
                onChange={(e) =>
                  modalMode === "create"
                    ? setNewProject((prev) => ({
                        ...prev!,
                        name: e.target.value,
                      }))
                    : setSelectedProject((prev) => ({
                        ...prev!,
                        name: e.target.value,
                      }))
                }
              />
            </Form.Item>
            <Form.Item label="Description" required>
              <TextArea
                placeholder="Description"
                value={
                  (modalMode === "create"
                    ? newProject?.description
                    : selectedProject?.description) || ""
                }
                onChange={(e) =>
                  modalMode === "create"
                    ? setNewProject((prev) => ({
                        ...prev!,
                        description: e.target.value,
                      }))
                    : setSelectedProject((prev) => ({
                        ...prev!,
                        description: e.target.value,
                      }))
                }
              />
            </Form.Item>
            <Form.Item label="Color" required>
              <ColorPicker
                value={
                  modalMode === "create"
                    ? newProject?.colorHex
                    : selectedProject?.colorHex
                }
                allowClear
                onChange={(c) =>
                  modalMode === "create"
                    ? setNewProject((prev) => ({
                        ...prev!,
                        colorHex: c.toHexString(),
                      }))
                    : setSelectedProject((prev) => ({
                        ...prev!,
                        colorHex: c.toHexString(),
                      }))
                }
              />
            </Form.Item>
            <Form.Item label="Client" required>
              <Select
                style={{ width: "100%" }}
                placeholder="Select Client"
                value={
                  selectedClient?.id ||
                  (modalMode === "update"
                    ? selectedProject?.client?.id
                    : undefined)
                }
                onChange={(value) =>
                  setSelectedClient(
                    users?.find((user) => user.id === value) || null
                  )
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
            {modalMode === "create" && (
              <Form.Item
                label="Creator"
                required
                rules={[
                  { required: true, message: "Creator is required" },
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject("Creator is required"),
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select Creator"
                  value={selectedCreator?.id}
                  onChange={(value) =>
                    setSelectedCreator(
                      users?.find((user) => user.id === value) || null
                    )
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
            )}
          </Form>
        )}

        {modalMode === "delete" && selectedProject && (
          <p>Are you sure you want to delete this project?</p>
        )}
      </CustomModal>
    </div>
  );
};

export default ProjectComponent;
