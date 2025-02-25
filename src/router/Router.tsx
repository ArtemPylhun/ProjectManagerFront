import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import NotFoundPage from "../components/common/NotFoundPage";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import UserPage from "../features/users/UserPage";
import RolePage from "../features/roles/RolePage";
import ProjectPage from "../features/projects/ProjectPage";
import ProjectTaskPage from "../features/projectTasks/ProjectTaskPage";
import TimeEntryPage from "../features/timeEntries/TimeEntryPage";
import HomePage from "../features/client/homePage/HomePage";
import ProjectsPage from "../features/client/homePage/projects/ProjectsPage";
import ProjectDetailPage from "../features/client/homePage/projects/ProjectDetailPage";
import ProjectTasksPage from "../features/client/homePage/projectTasks/ProjectTasksPage";
import TimeEntryUserPage from "../features/client/homePage/timeEntries/TimeEntryUserPage";
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
            path="/users-admin"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles-admin"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <RolePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects-admin"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <ProjectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project-tasks-admin"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <ProjectTaskPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/time-entries-admin"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <TimeEntryPage />
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
