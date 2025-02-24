import { useNavigate } from "react-router-dom";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  const isTokenExpired = () => {
    if (!user?.exp) return true;
    const expiryDate = new Date(user.exp * 1000);
    return expiryDate < new Date();
  };

  useEffect(() => {
    if (!user || isTokenExpired()) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || isTokenExpired()) {
    return null;
  }

  const userRoles = Array.isArray(user?.roles)
    ? user.roles.map((role: string) => role.trim())
    : user?.roles != null
    ? user.roles
    : [];
  return (
    <>
      {allowedRoles?.some((role) => userRoles?.includes(role)) ? (
        children
      ) : (
        <h1>Unauthorized</h1>
      )}
    </>
  );
};

export default ProtectedRoute;
