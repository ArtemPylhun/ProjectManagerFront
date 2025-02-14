import React, { useMemo } from "react";
import { Table, TableColumnsType, Space, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { RoleInterface } from "../../interfaces/RoleInterface";
import { RoleGroupInterface } from "../../interfaces/RoleGroupIntreface";

interface RolesTableProps {
  roles: RoleInterface[] | undefined;
  roleGroups: RoleGroupInterface[] | null;
  showModal: (
    project: RoleInterface | null,
    mode: "create" | "update" | "delete"
  ) => void;
}

const RolesTable: React.FC<RolesTableProps> = ({
  roles,
  roleGroups,
  showModal,
}) => {
  const columns: TableColumnsType<RoleInterface> = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Role Group",
        dataIndex: "roleGroup",
        key: "roleGroup",
        render: (roleGroup: number) =>
          roleGroups?.find((g) => g.id === roleGroup)?.name,
      },
      {
        title: "Actions",
        key: "actions",
        render: (role: RoleInterface) => (
          <Space>
            <Button
              color="primary"
              type="default"
              icon={<EditOutlined />}
              onClick={() => showModal(role, "update")}
            />
            <Button
              danger
              type="default"
              icon={<DeleteOutlined />}
              onClick={() => showModal(role, "delete")}
            />
          </Space>
        ),
      },
    ],
    [showModal]
  );

  if (!roles || roles.length === 0) return <p>No data</p>;

  return (
    <>
      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        className="modern-table"
        pagination={{ pageSize: 8 }}
      />
    </>
  );
};

export default React.memo(RolesTable);
