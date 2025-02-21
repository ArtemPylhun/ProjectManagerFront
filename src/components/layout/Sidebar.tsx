import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { theme } from "antd";
import { LockOutlined } from "@ant-design/icons";

type MenuItem = Required<MenuProps>["items"][number];

const Sidebar = () => {
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    path?: string,
    children?: MenuItem[]
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      onClick: path ? () => navigate(path) : undefined,
    } as MenuItem;
  }

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const adminPages = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Project Tasks", path: "/project-tasks" },
    { name: "Time Entries", path: "/time-entries" },
    { name: "Roles", path: "/roles" },
    { name: "Users", path: "/users" },
  ];

  const items: MenuItem[] = [
    getItem(
      "Admin",
      "admin",
      <LockOutlined />,
      undefined,
      adminPages.map((page) =>
        getItem(page.name, page.path, undefined, page.path)
      )
    ),
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={240}
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        backgroundColor: "#526ab7",
        overflow: "hidden",
      }}
    >
      <Menu
        theme="light"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items}
        style={{
          backgroundColor: "#b8d7fb",
          color: "#526ab7",
        }}
      />
    </Sider>
  );
};

export default Sidebar;
