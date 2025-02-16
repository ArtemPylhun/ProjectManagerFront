import React, { useMemo } from "react";
import {
  Table,
  TableColumnsType,
  Space,
  Tag,
  Button,
  Input,
  Select,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import CustomModal from "../../../../components/common/CustomModal";
import useUserModal from "../../hooks/useUserModal";
import { UserInterface } from "../../interfaces/UserInterface";
import useRoles from "../../../roles/hooks/useRoles";

interface UsersTableProps {
  users: UserInterface[] | null;
  handleCreateUser: (user: UserInterface) => Promise<boolean>;
  handleUpdateUser: (user: UserInterface) => Promise<boolean>;
  handleUpdateRoles: (userId: string, roles: string[]) => Promise<boolean>;
  handleDeleteUser: (userId: string) => Promise<boolean>;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  handleCreateUser,
  handleUpdateUser,
  handleUpdateRoles,
  handleDeleteUser,
}) => {
  const {
    modalMode,
    isModalVisible,
    selectedUser,
    selectedRoles,
    newUser,
    showModal,
    hideModal,
    setSelectedRoles,
    setNewUser,
    setSelectedUser,
  } = useUserModal();

  const { roles, loading } = useRoles(false);
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
          <Space>
            {roles.map((role) => (
              <Tag color={role === "Admin" ? "red" : "blue"} key={role}>
                {role}
              </Tag>
            ))}
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => showModal(user, "update_roles")}
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
              color="primary"
              type="default"
              icon={<EditOutlined />}
              onClick={() => showModal(user, "update_user")}
            />
            <Button
              danger
              type="default"
              icon={<DeleteOutlined />}
              onClick={() => showModal(user, "delete")}
            />
          </Space>
        ),
      },
    ],
    [showModal]
  );

  if (!users || users.length === 0) return <p>No data</p>;

  return (
    <>
      <div className="row">
        <Button
          className="md-2"
          type="default"
          icon={<PlusOutlined />}
          onClick={() => showModal(null, "create")}
        >
          Create User
        </Button>
      </div>

      <Table columns={columns} dataSource={users} rowKey="id" />

      <CustomModal
        visible={isModalVisible}
        title={
          modalMode === "create"
            ? "Create New User"
            : modalMode === "update_roles"
            ? "Edit User Roles"
            : modalMode === "update_user"
            ? "Update User Info"
            : "Delete User"
        }
        onOk={async () => {
          let result = false;
          switch (modalMode) {
            case "create":
              result = await handleCreateUser(newUser!);
              break;
            case "update_roles":
              result = await handleUpdateRoles(selectedUser!.id, selectedRoles);
              break;
            case "update_user":
              result = await handleUpdateUser(selectedUser!);
              break;
            case "delete":
              result = await handleDeleteUser(selectedUser!.id);
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
              placeholder="Username"
              value={newUser?.userName || ""}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev!, userName: e.target.value }))
              }
            />
            <Input
              placeholder="Email"
              value={newUser?.email || ""}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev!, email: e.target.value }))
              }
            />
            <Input.Password
              placeholder="Password"
              value={newUser?.password || ""}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev!, password: e.target.value }))
              }
            />
          </>
        )}

        {modalMode === "update_roles" && selectedUser && (
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Select roles"
            value={selectedRoles}
            onChange={setSelectedRoles}
            loading={loading}
          >
            {roles?.map((role) => (
              <Select.Option key={role.id} value={role.name}>
                {role.name}
              </Select.Option>
            ))}
          </Select>
        )}

        {modalMode === "update_user" && selectedUser && (
          <>
            <Input
              placeholder="Username"
              value={selectedUser?.userName || ""}
              onChange={(e) =>
                setSelectedUser((prev) => ({
                  ...prev!,
                  userName: e.target.value,
                }))
              }
            />
            <Space />
            <Input
              placeholder="Email"
              value={selectedUser?.email || ""}
              onChange={(e) =>
                setSelectedUser((prev) => ({ ...prev!, email: e.target.value }))
              }
            />
            <Space />
            <Input.Password
              placeholder="Password"
              value={selectedUser?.password || ""}
              onChange={(e) =>
                setSelectedUser((prev) => ({
                  ...prev!,
                  password: e.target.value,
                }))
              }
            />
          </>
        )}

        {modalMode === "delete" && selectedUser && (
          <p>Are you sure you want to delete this user?</p>
        )}
      </CustomModal>
    </>
  );
};

export default React.memo(UsersTable);
