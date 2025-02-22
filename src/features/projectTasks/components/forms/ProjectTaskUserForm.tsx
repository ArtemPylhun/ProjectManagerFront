import React, { useEffect } from "react";
import { Form, Select } from "antd";
import { UserTaskInterface } from "../../interfaces/UserTaskInterface";
import { ProjectTaskInterface } from "../../interfaces/ProjectTaskInterface";
import { UserInterface } from "../../../users/interfaces/UserInterface";
import "../../../../styles/styles.css";

interface ProjectTaskUserFormProps {
  form: any;
  userTaskData: UserTaskInterface | any | null;
  setUserTaskData: (data: any) => void;
  selectedProjectTask: ProjectTaskInterface | null;
  users: UserInterface[] | undefined;
  loading: boolean;
}

const ProjectTaskUserForm: React.FC<ProjectTaskUserFormProps> = ({
  form,
  userTaskData,
  setUserTaskData,
  selectedProjectTask,
  users,
  loading,
}) => {
  useEffect(() => {
    form.setFieldsValue({
      userId: userTaskData?.userId || null,
      projectTaskId: userTaskData?.projectTaskId || selectedProjectTask?.id,
    });
  }, [userTaskData, form]);

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
        label="Project Task"
        name="projectTaskId"
        rules={[{ required: true, message: "Please select a project task" }]}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select Project Task"
          value={selectedProjectTask?.id}
          disabled
        >
          <Select.Option
            key={selectedProjectTask?.id}
            value={selectedProjectTask?.id}
          >
            {selectedProjectTask?.name}
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
          value={userTaskData?.userId}
          onChange={(value) =>
            setUserTaskData((prev: any) => ({
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
    </Form>
  );
};

export default ProjectTaskUserForm;
