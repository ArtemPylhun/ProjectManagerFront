import { useState } from "react";
import SearchInput from "../../../components/common/SearchInput";
import LoaderComponent from "../../../components/common/Loader";
import RolesTable from "./table/RolesTable";
import useRoles from "../hooks/useRoles";

const UserComponent = () => {
  const {
    roles,
    loading,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
  } = useRoles();
  const [filterQuery, setFilterQuery] = useState<string>("");

  const handleFilterQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterQuery(event.target.value);
  };

  const filteredRoles = roles?.filter((role) => {
    return role.name.toLowerCase().includes(filterQuery.toLowerCase());
  });

  return (
    <div>
      <SearchInput
        query={filterQuery}
        onQueryChange={handleFilterQueryChange}
      />
      <LoaderComponent loading={loading}>
        <RolesTable
          roles={filteredRoles}
          handleCreateRole={handleCreateRole}
          handleUpdateRole={handleUpdateRole}
          handleDeleteRole={handleDeleteRole}
        />
      </LoaderComponent>
    </div>
  );
};
export default UserComponent;
