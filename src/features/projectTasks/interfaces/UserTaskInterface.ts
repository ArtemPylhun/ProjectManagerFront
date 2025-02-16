export interface UserTaskInterface {
  id: string;
  projectTaskId: string;
  userId: string;
}

export interface UserTaskCreateInterface {
  projectTaskId: string;
  userId: string;
}
