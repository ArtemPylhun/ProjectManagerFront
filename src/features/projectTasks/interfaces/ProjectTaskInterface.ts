import { ProjectInterface } from "../../projects/interfaces/ProjectInterface";
import { UserTaskInterface } from "./UserTaskInterface";
export interface ProjectTaskInterface {
  id: string;
  project: ProjectInterface;
  name: string;
  estimatedTime: number;
  description: string;
  status: number;
  usersTask: UserTaskInterface[];
}

export interface ProjectTaskCreateInterface {
  projectId: string;
  name: string;
  estimatedTime: number;
  description: string;
  status: number;
}

export interface ProjectTaskUpdateInterface {
  id: string;
  projectId: string;
  name: string;
  estimatedTime: number;
  description: string;
  status: number;
}
