import React, { useMemo } from "react";
import { Table, TableColumnsType, Space, Button, Input } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import CustomModal from "../../../../components/common/CustomModal";
import useRoleModal from "../../hooks/useRoleModal";
import {
  RoleInterface,
  RoleCreateInterface,
} from "../../interfaces/RoleInterface";

interface RolesTableProps {
  roles: RoleInterface[] | undefined;
  handleCreateRole: (role: RoleCreateInterface) => Promise<boolean>;
  handleUpdateRole: (role: RoleInterface) => Promise<boolean>;
  handleDeleteRole: (roleId: string) => Promise<boolean>;
}

const RolesTable: React.FC<RolesTableProps> = ({
  roles,
  handleCreateRole,
  handleUpdateRole,
  handleDeleteRole,
}) => {
  const {
    modalMode,
    isModalVisible,
    selectedRole,
    newRole,
    showModal,
    hideModal,
    setNewRole,
    setSelectedRole,
  } = useRoleModal();

  const columns: TableColumnsType<RoleInterface> = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
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
      <div className="row">
        <Button
          className="md-2"
          type="default"
          icon={<PlusOutlined />}
          onClick={() => showModal(null, "create")}
        >
          Create Role
        </Button>
      </div>

      <Table columns={columns} dataSource={roles} rowKey="id" />

      <CustomModal
        visible={isModalVisible}
        title={
          modalMode === "create"
            ? "Create New Role"
            : modalMode === "update"
            ? "Update Role Info"
            : "Delete Role"
        }
        onOk={async () => {
          let result = false;
          switch (modalMode) {
            case "create":
              result = await handleCreateRole(newRole!);
              break;
            case "update":
              result = await handleUpdateRole(selectedRole!);
              break;
            case "delete":
              result = await handleDeleteRole(selectedRole!.id);
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
            <Input
              placeholder="Name"
              value={newRole?.name || ""}
              onChange={(e) =>
                setNewRole((prev) => ({ ...prev!, name: e.target.value }))
              }
            />
          </>
        )}

        {modalMode === "update" && selectedRole && (
          <>
            <Input
              placeholder="Name"
              value={selectedRole?.name || ""}
              onChange={(e) =>
                setSelectedRole((prev) => ({
                  ...prev!,
                  name: e.target.value,
                }))
              }
            />
          </>
        )}

        {modalMode === "delete" && selectedRole && (
          <p>Are you sure you want to delete this role?</p>
        )}
      </CustomModal>
    </>
  );
};

export default React.memo(RolesTable);
