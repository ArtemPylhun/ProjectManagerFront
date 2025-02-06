import React from "react";
import UserInterface from "../../interfaces/UserInterface";
import { Table, TableColumnsType } from "antd";

interface UsersTableProps {
  users: UserInterface[] | undefined;
}

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  if (!users || users.length === 0) {
    return <p>No data</p>;
  }

  const columns: TableColumnsType<UserInterface> = [
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
    },
  ];

  return (
    <Table columns={columns} dataSource={users} rowKey="id" />

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

export default UsersTable;
