import { RuleObject } from "antd/es/form";

export const validateProjectTaskName = async (
  _: RuleObject,
  value: string
): Promise<void> => {
  if (!value) {
    return Promise.reject("Please enter a project task name");
  }
  if (value.length < 5) {
    return Promise.reject(
      "Project task name must be at least 5 characters long"
    );
  }
  if (value.length > 100) {
    return Promise.reject("Project task name cannot exceed 100 characters");
  }
  return Promise.resolve();
};

export const validateDescription = async (
  _: RuleObject,
  value: string
): Promise<void> => {
  if (!value) {
    return Promise.reject("Please enter a description");
  }
  if (value.length < 20) {
    return Promise.reject("Description must be at least 20 characters long");
  }
  if (value.length > 1000) {
    return Promise.reject("Description cannot exceed 1000 characters");
  }
  return Promise.resolve();
};

export const validateEstimatedTime = async (
  _: RuleObject,
  value: number | string
): Promise<void> => {
  const numValue = typeof value === "string" ? Number(value) : value;
  if (!numValue) {
    return Promise.reject("Please enter an estimated time");
  }
  if (isNaN(numValue)) {
    return Promise.reject("Estimated time must be a number");
  }
  if (numValue <= 0) {
    return Promise.reject("Estimated time must be greater than 0");
  }
  if (numValue > 999) {
    return Promise.reject("Estimated time cannot exceed 999 minutes");
  }
  return Promise.resolve();
};
