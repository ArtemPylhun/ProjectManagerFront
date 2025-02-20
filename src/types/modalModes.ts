export const ModalModes = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  UPDATE_ROLES: "update_roles",
  UPDATE_USER: "update_user",
  REMOVE_USER: "remove_user",
  ADD_USER: "add_user",
} as const;

export type ModalMode = (typeof ModalModes)[keyof typeof ModalModes];
