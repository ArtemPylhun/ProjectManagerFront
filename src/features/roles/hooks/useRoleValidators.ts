export const validateName = (_: any, value: string) => {
  if (!value) return Promise.reject("Name is required");
  if (value.length < 3)
    return Promise.reject("Name must be at least 3 characters long");
  return Promise.resolve();
};
