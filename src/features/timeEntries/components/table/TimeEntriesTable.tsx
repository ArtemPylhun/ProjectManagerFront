import React, { useMemo } from "react";
import { Button, Space, Table, TableColumnsType, Tooltip } from "antd";
import { TimeEntryInterface } from "../../interfaces/TimeEntryInterface";
import { UserInterface } from "../../../users/interfaces/UserInterface";
import { ProjectInterface } from "../../../projects/interfaces/ProjectInterface";
import { ProjectTaskInterface } from "../../../projectTasks/interfaces/ProjectTaskInterface";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ModalMode, ModalModes } from "../../../../types/modalModes";
interface TimeEntriesTableProps {
  timeEntries: TimeEntryInterface[] | undefined;
  users: UserInterface[] | undefined;
  projects: ProjectInterface[] | undefined;
  projectTasks: ProjectTaskInterface[] | undefined | null;
  showModal: (timeEntry: TimeEntryInterface | null, mode: ModalMode) => void;
}

const TimeEntriesTable: React.FC<TimeEntriesTableProps> = ({
  timeEntries,
  showModal,
}) => {
  const columns: TableColumnsType<TimeEntryInterface> = useMemo(
    () => [
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
        title: "Start Time",
        dataIndex: "startTime",
        key: "startTime",
        render: (startTime: Date) =>
          dayjs(startTime).format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        title: "End Time",
        dataIndex: "endTime",
        key: "endTime",
        render: (endTime: Date) => dayjs(endTime).format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        title: "Minutes",
        dataIndex: "minutes",
        key: "minutes",
      },
      {
        title: "User",
        dataIndex: "user",
        key: "user",
        render: (user: UserInterface) => user.userName,
      },
      {
        title: "Project",
        dataIndex: "project",
        key: "project",
        render: (project: ProjectInterface) => project.name,
      },
      {
        title: "Project Task",
        dataIndex: "projectTask",
        key: "projectTask",
        render: (projectTask: ProjectTaskInterface) => projectTask.name,
      },
      {
        title: "Actions",
        key: "actions",
        render: (timeEntry: TimeEntryInterface) => (
          <Space>
            <Button
              color="primary"
              type="default"
              icon={<EditOutlined />}
              onClick={() => showModal(timeEntry, ModalModes.UPDATE)}
            />
            <Button
              danger
              type="default"
              icon={<DeleteOutlined />}
              onClick={() => showModal(timeEntry, ModalModes.DELETE)}
            />
          </Space>
        ),
      },
    ],
    [showModal]
  );

  if (!timeEntries) return null;

  return (
    <Table
      columns={columns}
      dataSource={timeEntries}
      rowKey="id"
      className="modern-table"
      pagination={{ pageSize: 8 }}
    />
  );
};

export default TimeEntriesTable;
