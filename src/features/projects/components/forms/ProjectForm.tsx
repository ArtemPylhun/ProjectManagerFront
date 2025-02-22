import React, { useEffect } from "react";
import { Form, Input, ColorPicker, Select } from "antd";
import { ProjectInterface } from "../../interfaces/ProjectInterface";
import { UserInterface } from "../../../users/interfaces/UserInterface";
import "../../../../styles/styles.css";
import {
  validateDescription,
  validateProjectName,
} from "../../hooks/useProjectValidators";
interface ProjectFormProps {
  form: any;
  projectData: ProjectInterface | any | null;
  setProjectData: (data: any) => void;
  isCreateMode: boolean;
  users: UserInterface[] | undefined;
  selectedClient: UserInterface | null;
  selectedCreator: UserInterface | null;
  setSelectedClient: (user: UserInterface | null) => void;
  setSelectedCreator: (user: UserInterface | null) => void;
  loading: boolean;
}

const { TextArea } = Input;

const ProjectForm: React.FC<ProjectFormProps> = ({
  form,
  projectData,
  setProjectData,
  isCreateMode,
  users,
  selectedClient,
  selectedCreator,
  setSelectedClient,
  setSelectedCreator,
  loading,
}) => {
  useEffect(() => {
    form.setFieldsValue(projectData);
  }, [projectData]);

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
        label="Name"
        name="name"
        rules={[
          {
            validator: validateProjectName,
          },
        ]}
      >
        <Input
          placeholder="Name"
          value={projectData?.name || ""}
          onChange={(e) =>
            setProjectData((prev: any) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[
          {
            validator: validateDescription,
          },
        ]}
      >
        <TextArea
          placeholder="Description"
          maxLength={1000}
          value={projectData?.description || ""}
          onChange={(e) =>
            setProjectData((prev: any) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
      </Form.Item>
      <Form.Item
        label="Color"
        name="colorHex"
        rules={[{ required: true, message: "Please select a color" }]}
      >
        <ColorPicker
          value={projectData?.colorHex}
          allowClear
          onChangeComplete={(c) =>
            setProjectData((prev: any) => ({
              ...prev,
              colorHex: c.toHexString(),
            }))
          }
        />
      </Form.Item>
      <Form.Item
        label="Client"
        name="clientId"
        rules={[{ required: true, message: "Please select a client" }]}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select Client"
          value={selectedClient?.id}
          onChange={(value) =>
            setSelectedClient(users?.find((user) => user.id === value) || null)
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
      {isCreateMode && (
        <Form.Item
          label="Creator"
          name="creatorId"
          rules={[{ required: true, message: "Please select a creator" }]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="Select Creator"
            value={selectedCreator?.id}
            onChange={(value) =>
              setSelectedCreator(
                users?.find((user) => user.id === value) || null
              )
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
      )}
    </Form>
  );
};

export default ProjectForm;
