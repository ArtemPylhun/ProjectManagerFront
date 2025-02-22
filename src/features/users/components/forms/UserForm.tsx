import React, { useEffect } from "react";
import { Form, Input } from "antd";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "../../hooks/useUserValidators";
import "../../../../styles/styles.css";
import { UserInterface } from "../../interfaces/UserInterface";

interface UserFormProps {
  form: any;
  userData: UserInterface | null;
  setUserData: (data: any) => void;
  isCreateMode: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  form,
  userData,
  setUserData,
  isCreateMode,
}) => {
  useEffect(() => {
    form.setFieldsValue(userData);
  }, [userData]);

  const handleFinish = async () => {
    try {
      await form.validateFields();
      console.log("Validation passed!");
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="user-form"
    >
      <Form.Item
        label="Username"
        name="userName"
        rules={[{ required: true, validator: validateName }]}
      >
        <Input
          placeholder="Username"
          onChange={(e) =>
            setUserData((prev: any) => ({ ...prev, userName: e.target.value }))
          }
        />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, type: "email", validator: validateEmail }]}
      >
        <Input
          placeholder="Email"
          onChange={(e) =>
            setUserData((prev: any) => ({ ...prev, email: e.target.value }))
          }
        />
      </Form.Item>
      {isCreateMode && (
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, validator: validatePassword }]}
        >
          <Input.Password
            placeholder="Password"
            className="custom-password-input"
            onChange={(e) =>
              setUserData((prev: any) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
        </Form.Item>
      )}
    </Form>
  );
};

export default UserForm;
