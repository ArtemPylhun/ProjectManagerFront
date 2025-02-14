import { useCallback, useState } from "react";
import { Input, Form, Select, Button } from "antd";
import CustomModal from "../../../components/common/CustomModal";
import SearchInput from "../../../components/common/SearchInput";
import LoaderComponent from "../../../components/common/Loader";
import RolesTable from "./table/RolesTable";
import { PlusOutlined } from "@ant-design/icons";
import useRoles from "../hooks/useRoles";
import useRoleModal from "../hooks/useRoleModal";
import "./table/RolesTable.css";
const RoleComponent = () => {
  const {
    roles,
    roleGroups,
    loading,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
  } = useRoles();

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
  const [filterQuery, setFilterQuery] = useState<string>("");

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

    let result = false;

    if (modalMode === "create" && newRole) {
      result = await handleCreateRole(newRole);
    } else if (modalMode === "update" && selectedRole) {
      result = await handleUpdateRole(selectedRole);
    } else if (modalMode === "delete" && selectedRole) {
      result = await handleDeleteRole(selectedRole.id);
    }
    if (result) hideModal();
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
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal(null, "create")}
          style={{ height: "40px", display: "flex", alignItems: "center" }}
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
          modalMode === "create"
            ? "Create New Role"
            : modalMode === "update"
            ? "Update Role Info"
            : "Delete Role"
        }
        onOk={handleSave}
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
    </div>
  );
};
export default RoleComponent;
