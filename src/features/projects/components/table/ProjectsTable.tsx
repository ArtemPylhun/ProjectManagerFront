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
import { ModalMode, ModalModes } from "../../../../types/modalModes";
import "../../../../styles/styles.css";
import dayjs from "dayjs";

interface ProjectsTableProps {
  projects: ProjectInterface[] | undefined;
  users: UserInterface[] | undefined;
  roles: RoleInterface[] | undefined;
  showModal: (
    project: ProjectInterface | null,
    projectUser: ProjectUserInterface | null,
    mode: ModalMode
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
            <Tooltip
              title={description}
              styles={{
                body: {
                  backgroundColor: "rgba(184, 215, 251, 1)",
                  color: "rgba(255, 255, 255, 0.85)",
                },
              }}
            >
              <div className="description">{truncated}</div>
            </Tooltip>
          );
        },
      },
      {
        title: "Creation Date",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (createdAt: string) =>
          dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss"),
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
                    onClick={() =>
                      showModal(null, projectUser, ModalModes.REMOVE_USER)
                    }
                  >
                    Remove
                  </Button>
                </div>
              );
            })}
            <Button
              type="dashed"
              size="small"
              onClick={() => showModal(record, null, ModalModes.ADD_USER)}
            >
              + Add User
            </Button>
          </Space>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_: any, record: ProjectInterface) => (
          <Space>
            <Button
              className="action-button"
              icon={<EditOutlined />}
              onClick={() => showModal(record, null, ModalModes.UPDATE)}
            />
            <Button
              className="action-button danger"
              icon={<DeleteOutlined />}
              onClick={() => showModal(record, null, ModalModes.DELETE)}
            />
          </Space>
        ),
      },
    ],
    [showModal]
  );

  if (!projects) return null;

  return (
    <>
      <Table
        columns={columns}
        dataSource={projects}
        rowKey="id"
        className="modern-table"
        pagination={false}
      />
    </>
  );
};

export default React.memo(ProjectsTable);
