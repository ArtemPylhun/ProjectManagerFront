import React, { useEffect, useState } from "react";
import { Form, Input, Button, Space } from "antd";
import { UserService } from "../users/services/user.service";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { UserLoginInterface } from "../users/interfaces/UserInterface";
import { validateName } from "../users/hooks/useUserValidators";
import "../../styles/styles.css";
import { FacebookFilled } from "@ant-design/icons";
const Login: React.FC = () => {
  const [user, setUser] = useState<UserLoginInterface>({
    emailOrUsername: "",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for token in URL after Facebook redirect
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(decoded));

        let returnUrl = params.get("returnUrl") || "/";
        if (returnUrl.includes("/login")) {
          returnUrl = "/";
        }
        navigate(returnUrl, { replace: true });
      } catch (error) {
        console.error("Failed to process Facebook login");
      }
    }
  }, [location, navigate]);

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

  const handleFacebookLogin = () => {
    const returnUrl = `${window.location.origin}/login`;
    UserService.initiateFacebookLogin(returnUrl);
  };

  return (
    <Form onFinish={handleSubmit} layout="vertical" className="auth-form">
      <Form.Item
        label="Username"
        name="emailOrUsername"
        rules={[{ validator: validateName }]}
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
          id="password-auth"
          value={user.password}
          onChange={handleUserChange}
          name="password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="submit-button">
          Login
        </Button>
      </Form.Item>
      <Form.Item>
        <Button
          icon={<FacebookFilled />}
          type="default"
          onClick={handleFacebookLogin}
          block
        >
          Login with Facebook
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
