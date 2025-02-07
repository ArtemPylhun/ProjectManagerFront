import React from "react";
import UserInterface from "../../interfaces/UserInterface";
import { Table, TableColumnsType, Space, Tag } from "antd";

interface UsersTableProps {
  users: UserInterface[] | undefined;
}

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  if (!users || users.length === 0) {
    return <p>No data</p>;
  }

  const columns: TableColumnsType<UserInterface> = [
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
      render: (roles: string[]) => (
        <Space>
          {roles.map((role) => {
            let color =
              role === "Admin" ? "red" : role === "User" ? "blue" : "green";
            return (
              <Tag color={color} key={role}>
                {role}
              </Tag>
            );
          })}
        </Space>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
    },
  ];

  return <Table columns={columns} dataSource={users} rowKey="id" />;
};

export default UsersTable;
