import { useCallback, useState } from "react";
import SearchInput from "../../../components/common/SearchInput";
import LoaderComponent from "../../../components/common/Loader";
import UsersTable from "./table/UsersTable";
import useUserModal from "../hooks/useUserModal";
import CustomModal from "../../../components/common/CustomModal";
import useUsers from "../hooks/useUsers";
import useRoles from "../../roles/hooks/useRoles";
import { Button, Form, Input, Select, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const UserComponent = () => {
  const [filterQuery, setFilterQuery] = useState<string>("");

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

  const {
    users,
    loading,
    handleCreateUser,
    handleUpdateUser,
    handleUpdateRoles,
    handleDeleteUser,
  } = useUsers();

  const { roles } = useRoles(false, true);

  const handleFilterQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterQuery(event.target.value);
  };

  const filteredUsers = users
    ? users.filter(
        (user) =>
          user.userName.toLowerCase().includes(filterQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : null;

  const handleSave = useCallback(async () => {
    if (!modalMode) return;

    let result = false;

    if (modalMode === "create" && newUser) {
      result = await handleCreateUser(newUser);
    } else if (modalMode === "update_roles" && selectedUser && selectedRoles) {
      result = await handleUpdateRoles(selectedUser.id, selectedRoles);
    } else if (modalMode === "update_user" && selectedUser) {
      result = await handleUpdateUser(selectedUser);
    } else if (modalMode === "delete" && selectedUser) {
      result = await handleDeleteUser(selectedUser.id);
    }
    if (result) hideModal();
  }, [
    modalMode,
    newUser,
    selectedUser,
    selectedRoles,
    handleCreateUser,
    handleUpdateUser,
    handleUpdateRoles,
    handleDeleteUser,
  ]);

  return (
    <div>
      <div className="projects-header">
        <SearchInput
          query={filterQuery}
          onQueryChange={handleFilterQueryChange}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal(null, "create")}
          style={{ height: "40px", display: "flex", alignItems: "center" }}
        >
          Create User
        </Button>
      </div>

      <LoaderComponent loading={loading}>
        <UsersTable users={filteredUsers} showModal={showModal} />
      </LoaderComponent>

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
        onOk={handleSave}
        onCancel={hideModal}
      >
        {(modalMode === "create" || modalMode === "update_user") && (
          <Form layout="vertical">
            <Form.Item label="Username">
              <Input
                placeholder="Username"
                value={
                  modalMode === "create"
                    ? newUser?.userName
                    : selectedUser?.userName || ""
                }
                onChange={(e) =>
                  modalMode === "create"
                    ? setNewUser((prev) => ({
                        ...prev!,
                        userName: e.target.value,
                      }))
                    : setSelectedUser((prev) => ({
                        ...prev!,
                        userName: e.target.value,
                      }))
                }
              />
            </Form.Item>
            <Form.Item label="Email">
              <Input
                placeholder="Email"
                value={
                  modalMode === "create"
                    ? newUser?.email
                    : selectedUser?.email || ""
                }
                onChange={(e) =>
                  modalMode === "create"
                    ? setNewUser((prev) => ({
                        ...prev!,
                        email: e.target.value,
                      }))
                    : setSelectedUser((prev) => ({
                        ...prev!,
                        email: e.target.value,
                      }))
                }
              />
            </Form.Item>
            <Form.Item label="Password">
              <Input.Password
                placeholder="Password"
                value={
                  modalMode === "create"
                    ? newUser?.password
                    : selectedUser?.password || ""
                }
                onChange={(e) =>
                  modalMode === "create"
                    ? setNewUser((prev) => ({
                        ...prev!,
                        password: e.target.value,
                      }))
                    : setSelectedUser((prev) => ({
                        ...prev!,
                        password: e.target.value,
                      }))
                }
              />
            </Form.Item>
          </Form>
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

        {modalMode === "delete" && selectedUser && (
          <p>Are you sure you want to delete this user?</p>
        )}
      </CustomModal>
    </div>
  );
};

export default UserComponent;
