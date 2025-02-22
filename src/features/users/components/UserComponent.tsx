import { useCallback, useState } from "react";
import { Button, Select, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SearchInput from "../../../components/common/SearchInput";
import LoaderComponent from "../../../components/common/Loader";
import UsersTable from "./tables/UsersTable";
import CustomModal from "../../../components/common/CustomModal";
import UserForm from "./forms/UserForm";
import useUserModal from "../hooks/useUserModal";
import useUsers from "../hooks/useUsers";
import useRoles from "../../roles/hooks/useRoles";
import { ModalModes } from "../../../types/modalModes";
import "../../../styles/styles.css";

const UserComponent = () => {
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [form] = Form.useForm();

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
    try {
      await form.validateFields();
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
    } catch (error) {
      console.error("Validation failed:", error);
    }
  }, [
    modalMode,
    newUser,
    selectedUser,
    selectedRoles,
    handleCreateUser,
    handleUpdateUser,
    handleUpdateRoles,
    handleDeleteUser,
    form,
  ]);

  return (
    <div>
      <div className="projects-header">
        <SearchInput
          query={filterQuery}
          onQueryChange={handleFilterQueryChange}
        />
        <Button
          className="create-button"
          icon={<PlusOutlined />}
          onClick={() => showModal(null, ModalModes.CREATE)}
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
          <UserForm
            form={form}
            userData={modalMode === ModalModes.CREATE ? newUser : selectedUser!}
            setUserData={
              modalMode === ModalModes.CREATE ? setNewUser : setSelectedUser
            }
            isCreateMode={modalMode === ModalModes.CREATE}
          />
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
