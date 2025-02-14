import React, { useMemo } from "react";
import {
  Table,
  TableColumnsType,
  Space,
  Button,
  Input,
  Form,
  Select,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import CustomModal from "../../../../components/common/CustomModal";
import useRoleModal from "../../hooks/useRoleModal";
import {
  RoleInterface,
  RoleCreateInterface,
} from "../../interfaces/RoleInterface";
import { RoleGroupInterface } from "../../interfaces/RoleGroupIntreface";

interface RolesTableProps {
  roles: RoleInterface[] | undefined;
  roleGroups: RoleGroupInterface[] | null;
  handleCreateRole: (role: RoleCreateInterface) => Promise<boolean>;
  handleUpdateRole: (role: RoleInterface) => Promise<boolean>;
  handleDeleteRole: (roleId: string) => Promise<boolean>;
}

const RolesTable: React.FC<RolesTableProps> = ({
  roles,
  roleGroups,
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
        {(modalMode === "create" || modalMode === "update") && (
          <Form layout="vertical">
            <Form.Item label="Name" required>
              <Input
                placeholder="Name"
                value={
                  (modalMode === "create"
                    ? newRole?.name
                    : selectedRole?.name) || ""
                }
                onChange={(e) =>
                  modalMode === "create"
                    ? setNewRole((prev) => ({
                        ...prev!,
                        name: e.target.value,
                      }))
                    : setSelectedRole((prev) => ({
                        ...prev!,
                        name: e.target.value,
                      }))
                }
              />
            </Form.Item>

            <Form.Item label="Role group" required>
              <Select
                style={{ width: "100%" }}
                placeholder="Select Role group"
                value={
                  modalMode === "create" ? undefined : selectedRole?.roleGroup
                }
                onChange={(value) => {
                  const selectedGroup = roleGroups?.find(
                    (group) => group.id === value
                  );
                  if (!selectedGroup) return;

                  if (modalMode === "update") {
                    setSelectedRole((prev) => ({
                      ...prev!,
                      roleGroup: selectedGroup.id,
                    }));
                  } else {
                    setNewRole((prev) => ({
                      ...prev!,
                      roleGroup: selectedGroup.id,
                    }));
                  }
                }}
              >
                {roleGroups?.map((group) => (
                  <Select.Option key={Math.random()} value={group.id}>
                    {group.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        )}

        {modalMode === "delete" && selectedRole && (
          <p>Are you sure you want to delete this role?</p>
        )}
      </CustomModal>
    </>
  );
};

export default React.memo(RolesTable);
