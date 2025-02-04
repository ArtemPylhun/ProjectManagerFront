import React, { useState } from "react";
import { Form, Input, Button } from "antd";

interface UserLogin {
  email_username: string;
  password: string;
}

const Login = () => {
  const [user, setUser] = useState<UserLogin>({
    email_username: "",
    password: "",
  });

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (values: UserLogin) => {
    console.log(values);
  };

  return (
    <Form onFinish={handleSubmit} layout="vertical">
      <Form.Item label="Email or Username" name="email_username">
        <Input
          type="text"
          value={user.email_username}
          onChange={handleUserChange}
          name="email_username"
        />
      </Form.Item>
      <Form.Item label="Password" name="password">
        <Input
          type="password"
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
