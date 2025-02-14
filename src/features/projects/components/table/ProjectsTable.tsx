import React, { useMemo } from "react";
import { Table, TableColumnsType, Space, Button, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ProjectInterface } from "../../interfaces/ProjectInterface";
import { UserInterface } from "../../../users/interfaces/UserInterface";
import "./ProjectsTable.css";

interface ProjectsTableProps {
  projects: ProjectInterface[] | undefined;

  showModal: (
    project: ProjectInterface | null,
    mode: "create" | "update" | "delete"
  ) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
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
        title: "Actions",
        key: "actions",
        render: (project: ProjectInterface) => (
          <Space>
            <Button
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
