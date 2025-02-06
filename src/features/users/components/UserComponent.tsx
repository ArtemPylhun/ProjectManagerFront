import { useState } from "react";
import SearchInput from "../../../components/common/SearchInput";
import LoaderComponent from "../../../components/common/Loader";
import UsersTable from "./table/UsersTable";
import { useGetUsers } from "../hooks/useGetUsers";
const UserComponent = () => {
  const { users, loading, setUsers, turnOffLoading, turnOnLoading } =
    useGetUsers();
  const [filterQuery, setFilterQuery] = useState<string>("");

  const handleFilterQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilterQuery(event.target.value);
  };

  const filteredUsers = users?.filter((user) => {
    return user.userName.toLowerCase().includes(filterQuery.toLowerCase());
  });

  return (
    <div>
      <SearchInput
        query={filterQuery}
        onQueryChange={handleFilterQueryChange}
      />
      <LoaderComponent loading={loading}>
        <UsersTable users={filteredUsers} />
      </LoaderComponent>
    </div>
  );
};
export default UserComponent;
