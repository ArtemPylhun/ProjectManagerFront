import React, { useState } from "react";
import { Form, Input, Button } from "antd";

interface UserRegister {
  email: string;
  userName: string;
  password: string;
}

const Register = () => {
  const [user, setUser] = useState<UserRegister>({
    email: "",
    userName: "",
    password: "",
  });

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (values: UserRegister) => {
    console.log(values);
  };

  return (
    <Form onFinish={handleSubmit} layout="vertical">
      <Form.Item label="Email" name="email">
        <Input
          type="email"
          name="email"
          value={user.email}
          onChange={handleUserChange}
        />
      </Form.Item>
      <Form.Item label="Username" name="userName">
        <Input
          type="text"
          name="userName"
          value={user.userName}
          onChange={handleUserChange}
        />
      </Form.Item>
      <Form.Item label="Password" name="password">
        <Input
          type="password"
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
