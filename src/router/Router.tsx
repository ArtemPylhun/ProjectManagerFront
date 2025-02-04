import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import NotFoundPage from "../components/common/NotFoundPage";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
