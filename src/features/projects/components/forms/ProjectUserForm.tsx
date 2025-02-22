import React, { useEffect } from "react";
import { Form, Select } from "antd";
import { ProjectUserCreateInterface } from "../../interfaces/ProjectUserInterface";
import { UserInterface } from "../../../users/interfaces/UserInterface";
import { RoleInterface } from "../../../roles/interfaces/RoleInterface";
import "../../../../styles/styles.css";

interface ProjectUserFormProps {
  form: any;
  projectUserData: ProjectUserCreateInterface | null;
  setProjectUserData: (data: any) => void;
  selectedProject: any;
  users: UserInterface[] | undefined;
  roles: RoleInterface[] | undefined;
  loading: boolean;
}

const ProjectUserForm: React.FC<ProjectUserFormProps> = ({
  form,
  projectUserData,
  setProjectUserData,
  selectedProject,
  users,
  roles,
  loading,
}) => {
  useEffect(() => {
    form.setFieldsValue(projectUserData);
  }, [projectUserData]);

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
        label="Project"
        name="projectId"
        rules={[{ required: true, message: "Please select a project" }]}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select Project"
          value={selectedProject?.id}
          disabled
        >
          <Select.Option key={selectedProject?.id} value={selectedProject?.id}>
            {selectedProject?.name}
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="User"
        name="userId"
        rules={[{ required: true, message: "Please select a user" }]}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select User"
          value={projectUserData?.userId}
          onChange={(value) =>
            setProjectUserData((prev: any) => ({
              ...prev,
              userId: value,
            }))
          }
          loading={loading}
        >
          {users?.map((user) => (
            <Select.Option key={user.id} value={user.id}>
              {user.userName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Role"
        name="roleId"
        rules={[{ required: true, message: "Please select a role" }]}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select Role"
          value={projectUserData?.roleId}
          onChange={(value) =>
            setProjectUserData((prev: any) => ({
              ...prev,
              roleId: value,
            }))
          }
          loading={loading}
        >
          {roles?.map((role) => (
            <Select.Option key={role.id} value={role.id}>
              {role.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default ProjectUserForm;
