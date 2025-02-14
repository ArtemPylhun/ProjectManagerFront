import UserInterface from "../../users/interfaces/UserInterface";

export interface ProjectInterface {
  id: string;
  name: string;
  description: string;
  colorHex: string;
  creator: UserInterface;
  client: UserInterface;
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
  clientId: string;
}
