import { RuleObject } from "antd/es/form";
import dayjs from "dayjs";

export const validateDescription = async (
  _: RuleObject,
  value: string
): Promise<void> => {
  if (!value) {
    return Promise.reject("Please enter a description");
  }
  if (value.length > 1000) {
    return Promise.reject("Description cannot exceed 1000 characters");
  }
  return Promise.resolve();
};

export const validateStartTime = async (
  _: RuleObject,
  value: dayjs.Dayjs | null
): Promise<void> => {
  if (!value) {
    return Promise.reject("Please select a start time");
  }
  return Promise.resolve();
};

export const validateEndTime = async (
  _: RuleObject,
  value: dayjs.Dayjs | null
): Promise<void> => {
  if (!value) {
    return Promise.reject("Please select an end time");
  }
  return Promise.resolve();
  // Optionally, you can add logic to ensure endTime is after startTime if needed
};

export const validateUserId = async (
  _: RuleObject,
  value: number | null
): Promise<void> => {
  if (!value) {
    return Promise.reject("Please select a user");
  }
  return Promise.resolve();
};

export const validateProjectId = async (
  _: RuleObject,
  value: number | null
): Promise<void> => {
  if (!value) {
    return Promise.reject("Please select a project");
  }
  return Promise.resolve();
};
