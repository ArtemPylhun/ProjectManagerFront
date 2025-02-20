import React, { useMemo } from "react";
import { TableColumnsType, Space, Button, Table, Avatar, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ProjectTaskInterface } from "../../interfaces/ProjectTaskInterface";
import { UserTaskInterface } from "../../interfaces/UserTaskInterface";
import { ProjectInterface } from "../../../projects/interfaces/ProjectInterface";
import { ProjectTaskStatusInterface } from "../../interfaces/ProjectTaskStatusInterface";
import { UserInterface } from "../../../users/interfaces/UserInterface";
import { ModalMode, ModalModes } from "../../../../types/modalModes";

interface ProjectTasksTableProps {
  projectTasks: ProjectTaskInterface[] | undefined;
  projectTaskStatuses: ProjectTaskStatusInterface[] | null;
  users: UserInterface[] | undefined;
  showModal: (
    projectTask: ProjectTaskInterface | null,
    userTask: UserTaskInterface | null,
    mode: ModalMode
  ) => void;
}
const ProjectTasksTable: React.FC<ProjectTasksTableProps> = ({
  projectTasks,
  projectTaskStatuses,
  users,
  showModal,
}) => {
  const columns: TableColumnsType<ProjectTaskInterface> = useMemo(
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
        title: "Estimated Time",
        dataIndex: "estimatedTime",
        key: "estimatedTime",
      },
      {
        title: "Project",
        dataIndex: "project",
        key: "project",
        render: (project: ProjectInterface) => project.name,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status: number) =>
          projectTaskStatuses?.find((s) => s.id === status)?.name,
      },
      {
        title: "Users",
        dataIndex: "usersTask",
        key: "usersTask",
        render: (
          usersTask: UserTaskInterface[],
          record: ProjectTaskInterface
        ) => (
          <Space direction="vertical" style={{ width: "100%" }}>
            {usersTask.map((userTask) => {
              const user = users?.find((user) => user.id === userTask.userId);
              if (!user) return null;

              return (
                <div key={user.id} className="user-role-item">
                  <Avatar
                    size={30}
                    src={`https://ui-avatars.com/api/?name=${user.userName}`}
                  />
                  <span className="user-name">{user.userName}</span>
                  <Button
                    danger
                    size="small"
                    onClick={() =>
                      showModal(null, userTask, ModalModes.REMOVE_USER)
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
        render: (projectTask: ProjectTaskInterface) => (
          <Space>
            <Button
              color="primary"
              type="default"
              icon={<EditOutlined />}
              onClick={() => showModal(projectTask, null, ModalModes.UPDATE)}
            />
            <Button
              danger
              type="default"
              icon={<DeleteOutlined />}
              onClick={() => showModal(projectTask, null, ModalModes.DELETE)}
            />
          </Space>
        ),
      },
    ],
    [showModal]
  );

  if (!projectTasks || projectTasks.length === 0) return <p>No data</p>;

  return (
    <Table
      columns={columns}
      dataSource={projectTasks}
      rowKey="id"
      className="modern-table"
      pagination={{ pageSize: 8 }}
    />
  );
};

export default React.memo(ProjectTasksTable);
