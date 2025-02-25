import React, { useEffect } from "react";
import { Form, Input, Select } from "antd";
import { ProjectTaskInterface } from "../../interfaces/ProjectTaskInterface";
import { ProjectInterface } from "../../../projects/interfaces/ProjectInterface";
import {
  validateProjectTaskName,
  validateDescription,
  validateEstimatedTime,
} from "../../hooks/useProjectTaskValidators";
import "../../../../styles/styles.css";

interface ProjectTaskFormProps {
  form: any;
  projectTaskData: ProjectTaskInterface | any | null;
  setProjectTaskData: (data: any) => void;
  isCreateMode: boolean;
  projects: ProjectInterface[] | undefined;
  projectTaskStatuses: { id: number; name: string }[] | null;
  selectedProject: ProjectInterface | null;
  setSelectedProject: (project: ProjectInterface | null) => void;
  loading: boolean;
}

const { TextArea } = Input;

const ProjectTaskForm: React.FC<ProjectTaskFormProps> = ({
  form,
  projectTaskData,
  setProjectTaskData,
  isCreateMode,
  projects,
  projectTaskStatuses,
  selectedProject,
  setSelectedProject,
  loading,
}) => {
  useEffect(() => {
    form.setFieldsValue(projectTaskData);
  }, [projectTaskData, form]);

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
        rules={[{ validator: validateProjectTaskName }]}
      >
        <Input
          placeholder="Name"
          value={projectTaskData?.name || ""}
          onChange={(e) =>
            setProjectTaskData((prev: any) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ validator: validateDescription }]}
      >
        <TextArea
          placeholder="Description"
          maxLength={1000}
          value={projectTaskData?.description || ""}
          onChange={(e) =>
            setProjectTaskData((prev: any) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
      </Form.Item>
      <Form.Item
        label="Estimated Time"
        name="estimatedTime"
        rules={[{ validator: validateEstimatedTime }]}
      >
        <Input
          placeholder="Estimated Time, minutes"
          type="number"
          maxLength={3}
          value={projectTaskData?.estimatedTime || ""}
          onChange={(e) =>
            setProjectTaskData((prev: any) => ({
              ...prev,
              estimatedTime: Number(e.target.value),
            }))
          }
        />
      </Form.Item>
      <Form.Item
        label="Project"
        name="projectId"
        rules={[{ required: true, message: "Please select a project" }]}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select Project"
          value={
            isCreateMode ? projectTaskData?.project?.id : selectedProject?.id
          }
          onChange={(value) => {
            const project = projects?.find((p) => p.id === value) || null;
            setSelectedProject(project);
            setProjectTaskData((prev: ProjectTaskInterface) => ({
              ...prev,
              project: project,
              projectId: project?.id,
            }));
          }}
          disabled={!isCreateMode}
          loading={loading}
        >
          {projects?.map((project: ProjectInterface) => (
            <Select.Option key={project.id} value={project.id}>
              {project.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {!isCreateMode && (
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="Select Status"
            value={projectTaskData.status}
            onChange={(value) =>
              setProjectTaskData((prev: ProjectTaskInterface) => ({
                ...prev,
                status: value,
              }))
            }
          >
            {projectTaskStatuses?.map((status) => (
              <Select.Option key={status.id} value={status.id}>
                {status.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}
    </Form>
  );
};

export default ProjectTaskForm;
