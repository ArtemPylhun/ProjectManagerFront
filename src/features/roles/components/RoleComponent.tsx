import { useState } from "react";
import SearchInput from "../../../components/common/SearchInput";
import LoaderComponent from "../../../components/common/Loader";
import UsersTable from "./table/RolesTable";
import { useGetRoles } from "../hooks/useGetRoles";
import RolesTable from "./table/RolesTable";
const UserComponent = () => {
  const { roles, loading, setRoles, turnOffLoading, turnOnLoading } =
    useGetRoles();
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
        <RolesTable roles={filteredRoles} />
      </LoaderComponent>
    </div>
  );
};
export default UserComponent;
