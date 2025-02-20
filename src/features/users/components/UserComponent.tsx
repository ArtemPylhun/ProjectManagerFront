import { useCallback, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SearchInput from "../../../components/common/SearchInput";
import LoaderComponent from "../../../components/common/Loader";
import UsersTable from "./table/UsersTable";
import CustomModal from "../../../components/common/CustomModal";
import useUserModal from "../hooks/useUserModal";
import useUsers from "../hooks/useUsers";
import useRoles from "../../roles/hooks/useRoles";
import { ModalModes } from "../../../types/modalModes";
import { validateName } from "../hooks/useUserValidators";

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

    if (modalMode === ModalModes.CREATE && newUser) {
      result = await handleCreateUser(newUser);
    } else if (
      modalMode === ModalModes.UPDATE_ROLES &&
      selectedUser &&
      selectedRoles
    ) {
      result = await handleUpdateRoles(selectedUser.id, selectedRoles);
    } else if (modalMode === ModalModes.UPDATE_USER && selectedUser) {
      result = await handleUpdateUser(selectedUser);
    } else if (modalMode === ModalModes.DELETE && selectedUser) {
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
          onClick={() => showModal(null, ModalModes.CREATE)}
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
          modalMode === ModalModes.CREATE
            ? "Create New User"
            : modalMode === ModalModes.UPDATE_ROLES
            ? "Edit User Roles"
            : modalMode === ModalModes.UPDATE_USER
            ? "Update User Info"
            : "Delete User"
        }
        isDanger={modalMode === ModalModes.DELETE}
        okText={
          modalMode === ModalModes.DELETE
            ? "Delete"
            : modalMode === ModalModes.CREATE
            ? "Create"
            : "Update"
        }
        onOk={handleSave}
        onCancel={hideModal}
      >
        {(modalMode === ModalModes.CREATE ||
          modalMode === ModalModes.UPDATE_USER) && (
          <Form layout="vertical" onFinish={handleSave}>
            <Form.Item
              label="Username"
              rules={[{ required: true, validator: validateName }]}
            >
              <Input
                placeholder="Username"
                name="username"
                value={
                  modalMode === ModalModes.CREATE
                    ? newUser?.userName
                    : selectedUser?.userName || ""
                }
                onChange={(e) =>
                  modalMode === ModalModes.CREATE
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
                  modalMode === ModalModes.CREATE
                    ? newUser?.email
                    : selectedUser?.email || ""
                }
                onChange={(e) =>
                  modalMode === ModalModes.CREATE
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
            {modalMode === ModalModes.CREATE && (
              <Form.Item label="Password">
                <Input.Password
                  placeholder="Password"
                  value={newUser?.password}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev!,
                      password: e.target.value,
                    }))
                  }
                />
              </Form.Item>
            )}
          </Form>
        )}

        {modalMode === ModalModes.UPDATE_ROLES && selectedUser && (
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

        {modalMode === ModalModes.DELETE && selectedUser && (
          <p>Are you sure you want to delete this user?</p>
        )}
      </CustomModal>
    </div>
  );
};

export default UserComponent;
