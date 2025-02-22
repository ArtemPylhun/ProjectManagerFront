export const validateProjectName = (_: any, value: string) => {
  if (!value) return Promise.reject("Name is required");
  if (value.length < 3)
    return Promise.reject("Name must be at least 3 characters long");
  if (value.length > 30)
    return Promise.reject("Name must be at most 30 characters long");
  return Promise.resolve();
};

export const validateDescription = (_: any, value: string) => {
  if (!value) return Promise.reject("Description is required");
  if (value.length < 20)
    return Promise.reject("Description must be at least 20 characters long");
  if (value.length > 1000)
    return Promise.reject("Description must be at most 1000 characters long");
  return Promise.resolve();
};
