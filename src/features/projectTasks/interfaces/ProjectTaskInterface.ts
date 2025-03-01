import { ProjectInterface } from "../../projects/interfaces/ProjectInterface";
import { UserInterface } from "../../users/interfaces/UserInterface";
export interface ProjectTaskInterface {
  id: string;
  project: ProjectInterface;
  name: string;
  estimatedTime: number;
  description: string;
  status: number;
  createdAt: Date;
  creator: UserInterface;
}

export interface ProjectTaskCreateInterface {
  projectId: string;
  creatorId: string;
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
