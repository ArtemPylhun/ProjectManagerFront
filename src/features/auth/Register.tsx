import React, { useState } from "react";
import { Form, Input, Button, Alert, message } from "antd";
import { UserRegisterInterface } from "../users/interfaces/UserInterface";
import { UserService } from "../users/services/user.service";
import { useNavigate } from "react-router-dom";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../users/hooks/useUserValidators";
import "../../styles/authFormStyles.css";

const Register: React.FC = () => {
  const [user, setUser] = useState<UserRegisterInterface>({
    email: "",
    userName: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (values: UserRegisterInterface) => {
    try {
      const abortController = new AbortController();
      await UserService.registerUser(values, abortController.signal);
      navigate("/login");
    } catch (error: any) {
      message.error("Something went wrong while registering!");
    }
  };

  return (
    <div className="auth-container">
      <Form onFinish={handleSubmit} layout="vertical" className="auth-form">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { validator: validateEmail },
          ]}
        >
          <Input
            type="email"
            name="email"
            value={user.email}
            onChange={handleUserChange}
          />
        </Form.Item>

        <Form.Item
          label="Username"
          name="userName"
          rules={[
            { required: true, message: "Username is required" },
            { validator: validateName },
          ]}
        >
          <Input
            type="text"
            name="userName"
            value={user.userName}
            onChange={handleUserChange}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, validator: validatePassword }]}
        >
          <Input.Password
            id="password-auth"
            name="password"
            value={user.password}
            onChange={handleUserChange}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="submit-button">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
