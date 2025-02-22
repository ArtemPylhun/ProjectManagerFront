import { useCallback, useState } from "react";
import { Form, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ModalModes } from "../../../types/modalModes";
import CustomModal from "../../../components/common/CustomModal";
import SearchInput from "../../../components/common/SearchInput";
import LoaderComponent from "../../../components/common/Loader";
import RolesTable from "./table/RolesTable";
import useRoles from "../hooks/useRoles";
import useRoleModal from "../hooks/useRoleModal";
import "../../../styles/styles.css";
import RoleForm from "./forms/RoleForm";
const RoleComponent = () => {
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [form] = Form.useForm();

  const {
    roles,
    roleGroups,
    loading,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
  } = useRoles(false, false);

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

  const handleFilterQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterQuery(event.target.value);
  };

  const filteredRoles = roles
    ? roles.filter((role) => {
        const roleGroup = roleGroups?.find((g) => g.id === role.roleGroup);
        return (
          role.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
          (roleGroup &&
            roleGroup.name.toLowerCase().includes(filterQuery.toLowerCase()))
        );
      })
    : [];

  const handleSave = useCallback(async () => {
    if (!modalMode) return;

    try {
      await form.validateFields();

      let result = false;

      if (modalMode === ModalModes.CREATE && newRole) {
        result = await handleCreateRole(newRole);
      } else if (modalMode === ModalModes.UPDATE && selectedRole) {
        result = await handleUpdateRole(selectedRole);
      } else if (modalMode === ModalModes.DELETE && selectedRole) {
        result = await handleDeleteRole(selectedRole.id);
      }
      if (result) hideModal();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  }, [
    modalMode,
    newRole,
    selectedRole,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
    hideModal,
  ]);

  return (
    <div>
      <div className="projects-header">
        <SearchInput
          query={filterQuery}
          onQueryChange={handleFilterQueryChange}
        />
        <Button
          icon={<PlusOutlined />}
          onClick={() => showModal(null, ModalModes.CREATE)}
          className="create-button"
        >
          Create Role
        </Button>
      </div>

      <LoaderComponent loading={loading}>
        <RolesTable
          roles={filteredRoles}
          roleGroups={roleGroups}
          showModal={showModal}
        />
      </LoaderComponent>

      <CustomModal
        visible={isModalVisible}
        title={
          modalMode === ModalModes.CREATE
            ? "Create New Role"
            : modalMode === ModalModes.UPDATE
            ? "Update Role Info"
            : "Delete Role"
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
          modalMode === ModalModes.UPDATE) && (
          <RoleForm
            form={form}
            roleData={modalMode === ModalModes.CREATE ? newRole : selectedRole!}
            setRoleData={
              modalMode === ModalModes.CREATE ? setNewRole : setSelectedRole
            }
            roleGroups={roleGroups}
          />
        )}

        {modalMode === ModalModes.DELETE && selectedRole && (
          <p>Are you sure you want to delete this role?</p>
        )}
      </CustomModal>
    </div>
  );
};
export default RoleComponent;
