import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { UserService } from "../users/services/user.service";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { UserLoginInterface } from "../users/interfaces/UserInterface";
import { validateEmail, validateName } from "../users/hooks/useUserValidators";
import "../../styles/styles.css";
const Login: React.FC = () => {
  const [user, setUser] = useState<UserLoginInterface>({
    emailOrUsername: "",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (values: UserLoginInterface) => {
    try {
      const abortController = new AbortController();
      const response = await UserService.loginUser(
        values,
        abortController.signal
      );

      if (response) {
        const decoded = jwtDecode(response);
        localStorage.setItem("token", response);
        localStorage.setItem("user", JSON.stringify(decoded));

        const params = new URLSearchParams(location.search);
        const returnUrl = params.get("returnUrl") || "/";

        navigate(returnUrl);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <Form onFinish={handleSubmit} layout="vertical" className="user-form">
      <Form.Item
        label="Email or Username"
        name="emailOrUsername"
        rules={[
          { required: true, message: "Please enter your email or username" },
          { validator: validateEmail || validateName },
        ]}
      >
        <Input
          type="text"
          value={user.emailOrUsername}
          onChange={handleUserChange}
          name="emailOrUsername"
        />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please enter your password" }]}
      >
        <Input.Password
          value={user.password}
          onChange={handleUserChange}
          name="password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
