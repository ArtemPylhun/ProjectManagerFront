import React, { useMemo } from "react";
import {
  Table,
  TableColumnsType,
  Space,
  Button,
  Input,
  Select,
  ColorPicker,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import CustomModal from "../../../../components/common/CustomModal";
import useUsers from "../../../users/hooks/useUsers";
import useProjectModal from "../../hooks/useProjectModal";
import {
  ProjectInterface,
  ProjectCreateInterface,
  ProjectUpdateInterface,
} from "../../interfaces/ProjectInterface";
import UserInterface from "../../../users/interfaces/UserInterface";

const { TextArea } = Input;

interface ProjectsTableProps {
  projects: ProjectInterface[] | undefined;
  handleCreateProject: (role: ProjectCreateInterface) => Promise<boolean>;
  handleUpdateProject: (role: ProjectUpdateInterface) => Promise<boolean>;
  handleDeleteProject: (roleId: string) => Promise<boolean>;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  handleDeleteProject,
  handleCreateProject,
  handleUpdateProject,
}) => {
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

  const { users, loading } = useUsers();

  const columns: TableColumnsType<ProjectInterface> = useMemo(
    () => [
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
        title: "Creation Date",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (createdAt: string) => new Date(createdAt).toDateString(),
      },
      {
        title: "Color",
        dataIndex: "colorHex",
        key: "colorHex",
        render: (colorHex: string) => (
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: colorHex,
              borderRadius: 4,
              border: "1px solid #ccc",
              display: "inline-block",
            }}
          />
        ),
      },
      {
        title: "Creator",
        dataIndex: "creator",
        key: "creator",
        render: (creator: UserInterface) => creator.userName,
      },
      {
        title: "Client",
        dataIndex: "client",
        key: "client",
        render: (creator: UserInterface) => creator.userName,
      },
      {
        title: "Actions",
        key: "actions",
        render: (project: ProjectInterface) => (
          <Space>
            <Button
              color="primary"
              type="default"
              icon={<EditOutlined />}
              onClick={() => showModal(project, "update")}
            />
            <Button
              danger
              type="default"
              icon={<DeleteOutlined />}
              onClick={() => showModal(project, "delete")}
            />
          </Space>
        ),
      },
    ],
    [showModal]
  );

  if (!projects || projects.length === 0) return <p>No data</p>;

  return (
    <>
      <div className="row">
        <Button
          className="md-2"
          type="default"
          icon={<PlusOutlined />}
          onClick={() => showModal(null, "create")}
        >
          Create Project
        </Button>
      </div>

      <Table columns={columns} dataSource={projects} rowKey={"id"} />

      <CustomModal
        visible={isModalVisible}
        title={
          modalMode === "create"
            ? "Create New Project"
            : modalMode === "update"
            ? "Update Project"
            : "Delete Project"
        }
        onOk={async () => {
          let result = false;
          switch (modalMode) {
            case "create":
              console.log("CLIENT:", selectedClient);
              console.log("CREATOR:", selectedCreator);
              result = await handleCreateProject({
                ...newProject!,
                clientId: selectedClient!.id,
                creatorId: selectedCreator!.id,
              });
              break;
            case "update":
              console.log("CLIENT:", selectedClient);
              result = await handleUpdateProject({
                ...selectedProject!,
                clientId: selectedClient!.id,
              });
              break;
            case "delete":
              result = await handleDeleteProject(selectedProject!.id);
              break;
          }
          if (result) {
            hideModal();
          }
        }}
        onCancel={hideModal}
      >
        {modalMode === "create" && (
          <>
            <Space
              direction="vertical"
              size={"middle"}
              style={{ width: "100%" }}
            >
              <Input
                placeholder="Name"
                value={newProject?.name || ""}
                onChange={(e) =>
                  setNewProject((prev) => ({
                    ...prev!,
                    name: e.target.value,
                  }))
                }
              />
              <TextArea
                cols={4}
                placeholder="Description"
                value={newProject?.description || ""}
                onChange={(e) =>
                  setNewProject((prev) => ({
                    ...prev!,
                    description: e.target.value,
                  }))
                }
              />
              <ColorPicker
                value={newProject.colorHex}
                allowClear
                onChange={(c) => {
                  setNewProject((prev) => ({
                    ...prev!,
                    colorHex: c.toHexString(),
                  }));
                }}
              />
              <Select
                style={{ width: "100%" }}
                placeholder="Select client"
                value={selectedClient?.id}
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
              <Select
                style={{ width: "100%" }}
                placeholder="Select client"
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
            </Space>
          </>
        )}

        {modalMode === "update" && selectedProject && (
          <>
            <Space
              direction="vertical"
              size={"middle"}
              style={{ width: "100%" }}
            >
              <Input
                placeholder="Name"
                value={selectedProject?.name || ""}
                onChange={(e) =>
                  setSelectedProject((prev) => ({
                    ...prev!,
                    name: e.target.value,
                  }))
                }
              />
              <TextArea
                cols={4}
                placeholder="Description"
                value={selectedProject?.description || ""}
                onChange={(e) =>
                  setSelectedProject((prev) => ({
                    ...prev!,
                    description: e.target.value,
                  }))
                }
              />
              <ColorPicker
                value={selectedProject.colorHex}
                allowClear
                onChange={(c) => {
                  setSelectedProject((prev) => ({
                    ...prev!,
                    colorHex: c.toHexString(),
                  }));
                }}
              />
              <Select
                style={{ width: "100%" }}
                placeholder="Select client"
                value={
                  selectedClient?.id || selectedProject?.client?.id || undefined
                }
                onChange={(value) => {
                  const client =
                    users?.find((user) => user.id === value) ||
                    ({} as UserInterface);
                  setSelectedClient(client);
                  setSelectedProject((prev) =>
                    prev ? { ...prev, client } : null
                  );
                }}
                loading={loading}
              >
                {users?.map((user) => (
                  <Select.Option key={user.id} value={user.id}>
                    {user.userName}
                  </Select.Option>
                ))}
              </Select>
            </Space>
          </>
        )}

        {modalMode === "delete" && selectedProject && (
          <p>Are you sure you want to delete this project?</p>
        )}
      </CustomModal>
    </>
  );
};
export default React.memo(ProjectsTable);
