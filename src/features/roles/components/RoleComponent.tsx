import { useCallback } from "react";
import { Form, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ModalModes } from "../../../types/modalModes";
import CustomModal from "../../../components/common/CustomModal";
import SearchInput from "../../../components/common/SearchInput";
import LoaderComponent from "../../../components/common/Loader";
import RolesTable from "./table/RolesTable";
import useRoles from "../hooks/useRoles";
import useRoleModal from "../hooks/useRoleModal";
import "../../../styles/client-styles/projects/projectsStyles.css";
import RoleForm from "./forms/RoleForm";
const RoleComponent = () => {
  const [form] = Form.useForm();

  const {
    roles,
    roleGroups,
    loading,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
    currentPage,
    pageSize,
    totalCount,
    handlePageChange,
    searchQuery,
    setSearchQuery,
    handleSearch,
  } = useRoles(false, false, true);

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
    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery); // Update searchQuery state
    handleSearch(newSearchQuery); // Pass the new search query
  };

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
    <div className="projects-page">
      <div className="projects-header">
        <h1>Roles</h1>
        <SearchInput
          query={searchQuery}
          onQueryChange={handleFilterQueryChange}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          icon={<PlusOutlined />}
          onClick={() => showModal(null, ModalModes.CREATE)}
          className="create-project-button"
        >
          Create Role
        </Button>
      </div>

      <LoaderComponent loading={loading}>
        <RolesTable
          roles={roles || []}
          roleGroups={roleGroups}
          showModal={showModal}
          currentPage={currentPage || 1}
          pageSize={pageSize || 1}
          totalCount={totalCount || 1}
          handlePageChange={(page, newPageSize) =>
            handlePageChange?.(page, newPageSize)
          }
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
