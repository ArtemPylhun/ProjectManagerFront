import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { LockOutlined, LogoutOutlined } from "@ant-design/icons"; // Import LogoutOutlined for the logout icon
import "../../styles/client-styles/sidebarStyles.css"; // Import the new stylesheet

type MenuItem = Required<MenuProps>["items"][number];

const Sidebar = () => {
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    path?: string,
    children?: MenuItem[],
    className?: string // Add className for custom styling (e.g., Logout)
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

  const adminPages = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Project Tasks", path: "/project-tasks" },
    { name: "Time Entries", path: "/time-entries" },
    { name: "Roles", path: "/roles" },
    { name: "Users", path: "/users" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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
      trigger={null}
    >
      <div
        className="ant-layout-sider-trigger"
        onClick={() => setCollapsed(!collapsed)}
        style={{ cursor: "pointer" }}
      >
        {collapsed ? "►" : "◄"}
      </div>
      <Menu
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items}
        onClick={({ key }) => key === "logout" && handleLogout()} // Handle logout click
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
