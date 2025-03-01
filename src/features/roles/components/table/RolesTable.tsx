import React, { useMemo } from "react";
import { Table, TableColumnsType, Space, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { RoleInterface } from "../../interfaces/RoleInterface";
import { RoleGroupInterface } from "../../interfaces/RoleGroupIntreface";
import { ModalMode, ModalModes } from "../../../../types/modalModes";
import "../../../../styles/client-styles/projects/projectsStyles.css";

interface RolesTableProps {
  roles: RoleInterface[] | undefined;
  roleGroups: RoleGroupInterface[] | null;
  showModal: (project: RoleInterface | null, mode: ModalMode) => void;
  currentPage: number;
  pageSize: number;
  totalCount: number;
  handlePageChange: (page: number, newPageSize?: number | undefined) => void;
}

const RolesTable: React.FC<RolesTableProps> = ({
  roles,
  roleGroups,
  showModal,
  currentPage,
  pageSize,
  totalCount,
  handlePageChange,
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
              className="action-button"
              icon={<EditOutlined />}
              onClick={() => showModal(role, ModalModes.UPDATE)}
            />
            <Button
              className="action-button danger"
              icon={<DeleteOutlined />}
              onClick={() => showModal(role, ModalModes.DELETE)}
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
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalCount,
          showSizeChanger: true,
          onChange: handlePageChange,
        }}
      />
    </>
  );
};

export default React.memo(RolesTable);
