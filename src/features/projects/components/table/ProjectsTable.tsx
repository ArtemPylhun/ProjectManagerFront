import React, { useMemo } from "react";
import {
  Table,
  TableColumnsType,
  Space,
  Button,
  Tooltip,
  Avatar,
  Tag,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ProjectInterface } from "../../interfaces/ProjectInterface";
import { UserInterface } from "../../../users/interfaces/UserInterface";
import { RoleInterface } from "../../../roles/interfaces/RoleInterface";
import { ProjectUserInterface } from "../../interfaces/ProjectUserInterface";
import "./ProjectsTable.css";

interface ProjectsTableProps {
  projects: ProjectInterface[] | undefined;
  users: UserInterface[] | undefined;
  roles: RoleInterface[] | undefined;
  showModal: (
    project: ProjectInterface | null,
    projectUser: ProjectUserInterface | null,
    mode: "create" | "update" | "delete" | "add_user" | "remove_user"
  ) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  users,
  roles,
  showModal,
}) => {
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
          <div className="color-box" style={{ backgroundColor: colorHex }} />
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
        render: (client: UserInterface) => client.userName,
      },
      {
        title: "Users",
        dataIndex: "projectUsers",
        key: "projectUsers",
        render: (
          projectUsers: ProjectUserInterface[],
          record: ProjectInterface
        ) => (
          <Space direction="vertical" style={{ width: "100%" }}>
            {projectUsers.map((projectUser) => {
              const user = users?.find(
                (user) => user.id === projectUser.userId
              );
              const role = roles?.find(
                (role) => role.id === projectUser.roleId
              );
              if (!user) return null;

              return (
                <div key={user.id} className="user-role-item">
                  <Avatar
                    size={30}
                    src={`https://ui-avatars.com/api/?name=${user.userName}`}
                  />
                  <span className="user-name">{user.userName}</span>
                  <Tag color="blue">{role?.name || "No role"}</Tag>
                  <Button
                    danger
                    size="small"
                    onClick={() => showModal(null, projectUser, "remove_user")}
                  >
                    Remove
                  </Button>
                </div>
              );
            })}
            <Button
              type="dashed"
              size="small"
              onClick={() => showModal(record, null, "add_user")}
            >
              + Add User
            </Button>
          </Space>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        render: (project: ProjectInterface) => (
          <Space>
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => showModal(project, null, "update")}
            />
            <Button
              danger
              type="default"
              icon={<DeleteOutlined />}
              onClick={() => showModal(project, null, "delete")}
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
      <Table
        columns={columns}
        dataSource={projects}
        rowKey="id"
        className="modern-table"
        pagination={{ pageSize: 8 }}
      />
    </>
  );
};

export default React.memo(ProjectsTable);
