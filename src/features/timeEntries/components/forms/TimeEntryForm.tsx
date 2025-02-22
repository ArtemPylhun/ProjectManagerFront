import React, { useEffect } from "react";
import { Form, Input, Select, DatePicker } from "antd";
import { TimeEntryInterface } from "../../interfaces/TimeEntryInterface"; // Adjust the import path
import { UserInterface } from "../../../users/interfaces/UserInterface"; // Adjust the import path
import { ProjectInterface } from "../../../projects/interfaces/ProjectInterface"; // Adjust the import path
import { ProjectTaskInterface } from "../../../projectTasks/interfaces/ProjectTaskInterface"; // Adjust the import path
import {
  validateDescription,
  validateStartTime,
  validateEndTime,
  validateUserId,
  validateProjectId,
} from "../../hooks/useTimeEntryValidators";
import dayjs from "dayjs";

interface TimeEntryFormProps {
  form: any;
  timeEntryData: TimeEntryInterface | any | null;
  setTimeEntryData: (data: any) => void;
  isCreateMode: boolean;
  users: UserInterface[] | undefined;
  projects: ProjectInterface[] | undefined;
  projectTasks: ProjectTaskInterface[] | undefined;
  selectedUser: UserInterface | null;
  selectedProject: ProjectInterface | null;
  selectedProjectTask: ProjectTaskInterface | null;
  setSelectedUser: (user: UserInterface | null) => void;
  setSelectedProject: (project: ProjectInterface | null) => void;
  setSelectedProjectTask: (projectTask: ProjectTaskInterface | null) => void;
  loading: boolean;
}

const { TextArea } = Input;

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({
  form,
  timeEntryData,
  setTimeEntryData,
  isCreateMode,
  users,
  projects,
  projectTasks,
  selectedUser,
  selectedProject,
  selectedProjectTask,
  loading,
  setSelectedUser,
  setSelectedProject,
  setSelectedProjectTask,
}) => {
  useEffect(() => {
    form.setFieldsValue({
      description: timeEntryData?.description || "",
      startTime: timeEntryData?.startTime
        ? dayjs(timeEntryData.startTime)
        : null,
      endTime: timeEntryData?.endTime ? dayjs(timeEntryData.endTime) : null,
      userId: timeEntryData?.user?.id || null,
      projectId: timeEntryData?.project?.id || null,
      projectTaskId: timeEntryData?.projectTask?.id || null,
    });
  }, [timeEntryData]);

  const handleFinish = async () => {
    try {
      if (timeEntryData?.startTime && timeEntryData?.endTime) {
        timeEntryData.minutes = dayjs(timeEntryData.endTime).diff(
          dayjs(timeEntryData.startTime),
          "minute"
        );
      }
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
        label="Description"
        name="description"
        rules={[{ validator: validateDescription }]}
      >
        <TextArea
          placeholder="Description"
          maxLength={1000}
          value={timeEntryData?.description || ""}
          onChange={(e) =>
            setTimeEntryData((prev: TimeEntryInterface) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
      </Form.Item>
      <Form.Item
        label="Start Time"
        name="startTime"
        rules={[{ validator: validateStartTime }]}
      >
        <DatePicker
          showTime
          value={
            timeEntryData?.startTime ? dayjs(timeEntryData.startTime) : null
          }
          onChange={(value) =>
            setTimeEntryData((prev: TimeEntryInterface) => ({
              ...prev,
              startTime: new Date(dayjs(value).toISOString()),
            }))
          }
        />
      </Form.Item>
      <Form.Item
        label="End Time"
        name="endTime"
        rules={[{ validator: validateEndTime }]}
      >
        <DatePicker
          showTime
          value={timeEntryData?.endTime ? dayjs(timeEntryData.endTime) : null}
          onChange={(value) =>
            setTimeEntryData((prev: TimeEntryInterface) => ({
              ...prev,
              endTime: new Date(dayjs(value).toISOString()),
            }))
          }
        />
      </Form.Item>
      <Form.Item
        label="User"
        name="userId"
        rules={[{ validator: validateUserId }]}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select User"
          value={isCreateMode ? timeEntryData?.user?.id : selectedUser?.id}
          onChange={(value) => {
            const user = users?.find((u) => u.id === value) || null;
            setSelectedUser(user);
            setTimeEntryData((prev: TimeEntryInterface) => ({
              ...prev,
              user: user,
              userId: user?.id,
            }));
          }}
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
        label="Project"
        name="projectId"
        rules={[{ validator: validateProjectId }]}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select Project"
          value={
            isCreateMode ? timeEntryData?.project?.id : selectedProject?.id
          }
          onChange={(value) => {
            const project = projects?.find((p) => p.id === value) || null;
            setSelectedProject(project);
            setTimeEntryData((prev: TimeEntryInterface) => ({
              ...prev,
              project: project,
              projectId: project?.id,
            }));
          }}
          loading={loading}
        >
          {projects?.map((project) => (
            <Select.Option key={project.id} value={project.id}>
              {project.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Project Task" name="projectTaskId">
        <Select
          style={{ width: "100%" }}
          placeholder="Select Project Task"
          value={
            isCreateMode
              ? timeEntryData?.projectTask?.id
              : selectedProjectTask?.id
          }
          onChange={(value) => {
            const projectTask =
              projectTasks?.find((pt) => pt.id === value) || null;
            setSelectedProjectTask(projectTask);
            setTimeEntryData((prev: TimeEntryInterface) => ({
              ...prev,
              projectTask: projectTask,
              projectTaskId: projectTask?.id,
            }));
          }}
          loading={loading}
        >
          {projectTasks
            ?.filter((pt) => pt.project.id === selectedProject?.id)
            .map((projectTask) => (
              <Select.Option key={projectTask.id} value={projectTask.id}>
                {projectTask.name}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default TimeEntryForm;
