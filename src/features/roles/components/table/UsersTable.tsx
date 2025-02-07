import React from "react";
import RoleInterface from "../../interfaces/RoleInterface";
import { Table, TableColumnsType } from "antd";

interface RolesTableProps {
  roles: RoleInterface[] | undefined;
}

const RolesTable: React.FC<RolesTableProps> = ({ roles }) => {
  if (!roles || roles.length === 0) {
    return <p>No data</p>;
  }

  const columns: TableColumnsType<RoleInterface> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
  ];

  return (
    <Table columns={columns} dataSource={roles} rowKey="id" />

    // <TableContainer component={Paper} sx={{ marginY: "1rem" }}>
    //   <Table>
    //     <TableHead>
    //       <TableRow>
    //         <TableCell align="center">Username</TableCell>
    //         <TableCell align="center">Email</TableCell>
    //         <TableCell align="center">Actions</TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       {users.map((user) => (
    //         <UserTableRow
    //           key={user.id}
    //           user={user}
    //           onUserDelete={onUserItemDelete}
    //           onUserUpdate={onUserUpdate}
    //         />
    //       ))}
    //     </TableBody>
    //   </Table>
    // </TableContainer>
  );
};

export default RolesTable;
