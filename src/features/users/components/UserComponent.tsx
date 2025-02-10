import { useState } from "react";
import SearchInput from "../../../components/common/SearchInput";
import LoaderComponent from "../../../components/common/Loader";
import UsersTable from "./table/UsersTable";
import useUsers from "../hooks/useUsers";

const UserComponent = () => {
  const {
    users,
    loading,
    handleCreateUser,
    handleUpdateUser,
    handleUpdateRoles,
    handleDeleteUser,
  } = useUsers();
  const [filterQuery, setFilterQuery] = useState<string>("");

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

  return (
    <div>
      <SearchInput
        query={filterQuery}
        onQueryChange={handleFilterQueryChange}
      />
      <LoaderComponent loading={loading}>
        <UsersTable
          users={filteredUsers}
          handleCreateUser={handleCreateUser}
          handleUpdateUser={handleUpdateUser}
          handleUpdateRoles={handleUpdateRoles}
          handleDeleteUser={handleDeleteUser}
        />
      </LoaderComponent>
    </div>
  );
};

export default UserComponent;
