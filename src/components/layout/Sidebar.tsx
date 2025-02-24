import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import {
  LockOutlined,
  HomeOutlined,
  FundProjectionScreenOutlined,
  ProjectOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "../../styles/client-styles/sidebarStyles.css";

type MenuItem = Required<MenuProps>["items"][number];

const Sidebar = () => {
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    path?: string,
    children?: MenuItem[],
    className?: string
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      onClick: path ? () => navigate(path) : undefined,
      className,
    } as MenuItem;
  }

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.warn("USER_ROLES:", user);
  const roles = Array.isArray(user?.roles)
    ? user.roles.map((role: string) => role.trim())
    : user.roles;
  console.log(roles);
  const isAdmin = roles.includes("Admin");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const items: MenuItem[] = [
    getItem("Home", "/", <HomeOutlined />, "/"), // Home item for all users
    getItem(
      "Project",
      "projects",
      <FundProjectionScreenOutlined />,
      "/projects",
      undefined,
      "user-menu-item"
    ),
    getItem(
      "Project Task",
      "project-tasks",
      <ProjectOutlined />,
      "/project-tasks",
      undefined,
      "user-menu-item"
    ),
    getItem(
      "Time Entries",
      "time-entries",
      <CalendarOutlined />,
      "/time-entries",
      undefined,
      "user-menu-item"
    ),
    ...(isAdmin
      ? [
          getItem(
            "Admin",
            "admin",
            <LockOutlined />,
            undefined,
            [
              { name: "Projects", path: "/projects-admin" },
              { name: "Project Tasks", path: "/project-tasks-admin" },
              { name: "Time Entries", path: "/time-entries-admin" },
              { name: "Roles", path: "/roles-admin" },
              { name: "Users", path: "/users-admin" },
            ].map((page) => getItem(page.name, page.path, undefined, page.path))
          ),
        ]
      : []),
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={240}
      collapsedWidth={60}
      trigger={null}
      className="custom-sider"
    >
      <div
        className="ant-layout-sider-trigger"
        onClick={() => setCollapsed(!collapsed)}
        style={{ cursor: "pointer" }}
      >
        {collapsed ? "►" : "◄"}
      </div>
      <Menu
        theme="light"
        defaultSelectedKeys={["/"]}
        mode="inline"
        items={items}
        onClick={({ key }) => key === "logout" && handleLogout()}
      />
      <div
        className="ant-layout-sider-logout-trigger"
        onClick={handleLogout}
        style={{ cursor: "pointer" }}
      >
        <LogoutOutlined />
        {!collapsed && (
          <span style={{ color: "#ff4d4f", marginLeft: "12px" }}>Logout</span>
        )}
      </div>
    </Sider>
  );
};

export default Sidebar;
