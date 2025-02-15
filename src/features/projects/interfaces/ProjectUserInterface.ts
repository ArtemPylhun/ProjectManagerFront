export interface ProjectUserInterface {
  id: string;
  projectId: string;
  roleId: string;
  userId: string;
}

export interface ProjectUserCreateInterface {
  projectId: string;
  roleId: string;
  userId: string;
}
