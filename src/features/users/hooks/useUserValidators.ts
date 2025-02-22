export const validateEmail = (_: any, value: string) => {
  if (!value) return Promise.reject("Email is required");
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
    return Promise.reject("Invalid email address");
  return Promise.resolve();
};

export const validatePassword = (_: any, value: string) => {
  if (!value) return Promise.reject("Password is required");
  if (value.length < 8)
    return Promise.reject("Password must be at least 8 characters long");
  if (!/[A-Z]/.test(value))
    return Promise.reject(
      "Password must contain at least one uppercase letter"
    );
  if (!/[a-z]/.test(value))
    return Promise.reject(
      "Password must contain at least one lowercase letter"
    );
  if (!/\d/.test(value))
    return Promise.reject("Password must contain at least one digit");
  return Promise.resolve();
};

export const validateName = (_: any, value: string) => {
  if (!value) return Promise.reject("Name is required");
  if (value.length < 3)
    return Promise.reject("Name must be at least 3 characters long");
  return Promise.resolve();
};
