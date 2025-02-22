import React, { useMemo } from "react";
import { Table, TableColumnsType, Space, Tag, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { UserInterface } from "../../interfaces/UserInterface";
import { ModalMode, ModalModes } from "../../../../types/modalModes";
import "../../../../styles/styles.css";
interface UsersTableProps {
  users: UserInterface[] | null;
  showModal: (user: UserInterface | null, mode: ModalMode) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, showModal }) => {
  const columns: TableColumnsType<UserInterface> = useMemo(
    () => [
      {
        title: "Username",
        dataIndex: "userName",
        key: "userName",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Roles",
        dataIndex: "roles",
        key: "roles",
        render: (roles: string[] = [], user: UserInterface) => (
          <Space className="user-role-item">
            {roles.map((role) => (
              <Tag
                color={role === "Admin" ? "red" : "blue"}
                key={role}
                className="user-role"
              >
                {role}
              </Tag>
            ))}
            <Button
              className="action-button"
              icon={<EditOutlined />}
              onClick={() => showModal(user, ModalModes.UPDATE_ROLES)}
            />
          </Space>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        render: (user: UserInterface) => (
          <Space>
            <Button
              className="action-button"
              icon={<EditOutlined />}
              onClick={() => showModal(user, ModalModes.UPDATE_USER)}
            />
            <Button
              className="action-button danger"
              icon={<DeleteOutlined />}
              onClick={() => showModal(user, ModalModes.DELETE)}
            />
          </Space>
        ),
      },
    ],
    [showModal]
  );

  if (!users || users.length === 0) return <p>No data</p>;

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="id"
      className="modern-table"
      pagination={{ pageSize: 8 }}
    />
  );
};

export default React.memo(UsersTable);
