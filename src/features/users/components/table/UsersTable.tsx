import React, { useState } from "react";
import UserInterface from "../../interfaces/UserInterface";
import { Table, TableColumnsType, Space, Tag, Button, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { UserService } from "../../services/user.service";
import CustomModal from "../../../../components/common/CustomModal";
import { Select, Input } from "antd";

interface UsersTableProps {
  users: UserInterface[] | null;
  setUsers: React.Dispatch<React.SetStateAction<UserInterface[] | null>>;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, setUsers }) => {
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [newUser, setNewUser] = useState<UserInterface | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<
    "create" | "update_roles" | "delete" | "update_user"
  >("create");

  if (!users || users.length === 0) {
    return <p>No data</p>;
  }

  const showModal = (
    user: UserInterface | null,
    mode: "create" | "update_roles" | "delete" | "update_user"
  ) => {
    setModalMode(mode);
    if (mode !== "create") {
      setSelectedUser({
        id: user?.id || "",
        userName: user?.userName || "",
        email: user?.email || "",
        password: user?.password || "",
        roles: user?.roles || [],
      });
      setSelectedRoles(user?.roles || []);
    } else {
      setNewUser({
        id: "",
        email: "",
        userName: "",
        password: "",
        roles: [],
      });
    }
    setIsModalVisible(true);
  };

  const handleRoleChange = (newRoles: string[]) => {
    setSelectedRoles(newRoles);
  };

  const handleUpdateRoles = async () => {
    if (!selectedUser) return;
    try {
      await UserService.updateRoles(
        selectedUser.id,
        selectedRoles,
        new AbortController().signal
      );

      setUsers((prevUsers) => {
        if (!prevUsers) return null;
        return prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, roles: selectedRoles } : user
        );
      });

      message.success("Roles updated successfully!");
      setIsModalVisible(false);
    } catch (error) {
      message.error(`Failed to update roles: ${error}`);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser) return;
    try {
      const createdUser = await UserService.registerUser(
        newUser,
        new AbortController().signal
      );

      let user = await UserService.getUserWithRolesById(
        createdUser.id,
        new AbortController().signal
      );
      setUsers((prevUsers) => (prevUsers ? [...prevUsers, user] : [user]));
      message.success("User created successfully!");
      setIsModalVisible(false);
    } catch (error) {
      message.error(`Failed to create user: ${error}`);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    console.log("USer Before update: ", selectedUser);
    try {
      await UserService.updateUser(selectedUser, new AbortController().signal);

      setUsers((prevUsers) =>
        prevUsers
          ? prevUsers.map((user) =>
              user.id === selectedUser.id ? { ...user, ...selectedUser } : user
            )
          : []
      );

      message.success("User updated successfully!");
      setIsModalVisible(false);
    } catch (error) {
      message.error(`Failed to update user: ${error}`);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await UserService.deleteUserById(
        selectedUser.id,
        new AbortController().signal
      );
      setUsers((prevUsers) =>
        prevUsers ? prevUsers.filter((user) => user.id !== selectedUser.id) : []
      );
      message.success("User deleted successfully!");
      setIsModalVisible(false);
    } catch (error) {
      message.error(`Failed to delete user: ${error}`);
    }
  };

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
      render: (roles: string[] | undefined, user: UserInterface) => (
        <>
          <Space>
            {(roles || []).map((role) => {
              let color =
                role === "Admin" ? "red" : role === "User" ? "blue" : "green";
              return (
                <Tag color={color} key={role}>
                  {role}
                </Tag>
              );
            })}
          </Space>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => showModal(user, "update_roles")}
          />
          <Button
            danger={true}
            icon={<DeleteOutlined />}
            onClick={() => showModal(user, "delete")}
          />
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => showModal(user, "update_user")}
          />
        </>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
    },
  ];

  return (
    <>
      <Button
        type="default"
        icon={<EditOutlined />}
        onClick={() => showModal(null, "create")}
      >
        CreateUser
      </Button>
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
        onOk={
          modalMode === "create"
            ? handleCreateUser
            : modalMode === "update_roles"
            ? handleUpdateRoles
            : modalMode === "update_user"
            ? handleUpdateUser
            : handleDeleteUser
        }
        onCancel={() => setIsModalVisible(false)}
      >
        {modalMode === "create" && (
          <>
            <Input
              placeholder="Username"
              value={newUser?.userName}
              onChange={(e) =>
                setNewUser({ ...newUser!, userName: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              value={newUser?.email}
              onChange={(e) =>
                setNewUser({ ...newUser!, email: e.target.value })
              }
            />
            <Input.Password
              placeholder="Password"
              value={newUser?.password}
              onChange={(e) =>
                setNewUser({ ...newUser!, password: e.target.value })
              }
            />
          </>
        )}

        {modalMode === "update_roles" && (
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Select roles"
            value={selectedRoles}
            onChange={handleRoleChange}
          >
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="User">User</Select.Option>
            <Select.Option value="Guest">Guest</Select.Option>
          </Select>
        )}

        {modalMode === "update_user" && (
          <>
            <Input
              placeholder="Username"
              value={selectedUser?.userName}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser!, userName: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              value={selectedUser?.email}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser!, email: e.target.value })
              }
            />
            <Input.Password
              placeholder="Password"
              value={selectedUser?.password}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser!, password: e.target.value })
              }
            />
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Select roles"
              value={selectedRoles}
              onChange={handleRoleChange}
            >
              <Select.Option value="Admin">Admin</Select.Option>
              <Select.Option value="User">User</Select.Option>
            </Select>
          </>
        )}

        {modalMode === "delete" && (
          <p>Are you sure you want to delete this user?</p>
        )}
      </CustomModal>
    </>
  );
};

export default UsersTable;
