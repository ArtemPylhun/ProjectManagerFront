import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { UserRegisterInterface } from "../users/interfaces/UserInterface";
import { UserService } from "../users/services/user.service";
import { useNavigate } from "react-router-dom";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../users/hooks/useUserValidators";

const Register = () => {
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
    const abortController = new AbortController();
    const response = await UserService.registerUser(
      values,
      abortController.signal
    );

    if (response) {
      navigate("/login");
    }
  };

  return (
    <Form onFinish={handleSubmit} layout="vertical">
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
          name="password"
          value={user.password}
          onChange={handleUserChange}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;
