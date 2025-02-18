import { ProjectInterface } from "../../projects/interfaces/ProjectInterface";
import { ProjectTaskInterface } from "../../projectTasks/interfaces/ProjectTaskInterface";
import { UserInterface } from "../../users/interfaces/UserInterface";

export interface TimeEntryInterface {
  id: string;
  description: string;
  startTime: Date;
  endTime: Date;
  minutes: number;
  user: UserInterface;
  project: ProjectInterface;
  projectTask: ProjectTaskInterface | null;
}

export interface TimeEntryCreateInterface {
  description: string;
  startTime: Date;
  endTime: Date;
  minutes: number;
  userId: string;
  projectId: string;
  projectTaskId: string | null;
}

export interface TimeEntryUpdateInterface {
  id: string;
  description: string;
  startTime: Date;
  endTime: Date;
  minutes: number;
  userId: string;
  projectId: string;
  projectTaskId: string | null;
}
