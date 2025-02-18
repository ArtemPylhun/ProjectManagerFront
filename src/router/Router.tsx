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

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
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
              <ProtectedRoute allowedRoles={["Admin"]}>
                <ProjectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project-tasks"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <ProjectTaskPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/time-entries"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <TimeEntryPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
