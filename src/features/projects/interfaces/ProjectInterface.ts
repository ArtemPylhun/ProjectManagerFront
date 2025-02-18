import { UserInterface } from "../../users/interfaces/UserInterface";
import { ProjectUserInterface } from "./ProjectUserInterface";

export interface ProjectInterface {
  id: string;
  name: string;
  description: string;
  colorHex: string;
  creator: UserInterface;
  client: UserInterface;
  projectUsers: ProjectUserInterface[];
}

export interface ProjectCreateInterface {
  name: string;
  description: string;
  colorHex: string;
  creatorId: string;
  clientId: string;
}

export interface ProjectUpdateInterface {
  id: string;
  name: string;
  description: string;
  colorHex: string;
}
