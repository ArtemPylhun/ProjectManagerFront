import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import NotFoundPage from "../components/common/NotFoundPage";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import UserPage from "../features/users/UserPage";
import RolePage from "../features/roles/RolePage";
import HomePage from "../features/homePage/HomePage";
import ProjectsPage from "../features/projects/components/ProjectsPage";
import ProjectDetailPage from "../features/projects/components/ProjectDetailPage";
import ProjectTasksPage from "../features/projectTasks/components/ProjectTasksPage";
import TimeEntryUserPage from "../features/timeEntries/components/TimeEntryUserPage";
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <RolePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute allowedRoles={["User", "Admin"]}>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute allowedRoles={["User", "Admin"]}>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project-tasks/"
            element={
              <ProtectedRoute allowedRoles={["User", "Admin"]}>
                <ProjectTasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/time-entries/"
            element={
              <ProtectedRoute allowedRoles={["User", "Admin"]}>
                <TimeEntryUserPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
