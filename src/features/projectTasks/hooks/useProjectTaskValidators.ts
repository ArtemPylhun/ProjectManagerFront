import { RuleObject } from "antd/es/form";

export const validateProjectTaskName = async (
  _: RuleObject,
  value: string
): Promise<void> => {
  if (!value) {
    throw new Error("Please enter a project task name");
  }
  if (value.length < 5) {
    throw new Error("Project task name must be at least 5 characters long");
  }
  if (value.length > 100) {
    throw new Error("Project task name cannot exceed 100 characters");
  }
};

export const validateDescription = async (
  _: RuleObject,
  value: string
): Promise<void> => {
  if (!value) {
    throw new Error("Please enter a description");
  }
  if (value.length < 20) {
    throw new Error("Description must be at least 20 characters long");
  }
  if (value.length > 1000) {
    throw new Error("Description cannot exceed 1000 characters");
  }
};

export const validateEstimatedTime = async (
  _: RuleObject,
  value: number | string
): Promise<void> => {
  const numValue = typeof value === "string" ? Number(value) : value;
  if (!numValue) {
    throw new Error("Please enter an estimated time");
  }
  if (isNaN(numValue)) {
    throw new Error("Estimated time must be a number");
  }
  if (numValue <= 0) {
    throw new Error("Estimated time must be greater than 0");
  }
  if (numValue > 999) {
    throw new Error("Estimated time cannot exceed 999 minutes");
  }
};
