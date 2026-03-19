import { AlertEnum } from "../enum/AlertEnum.enum";

export interface Alert {
  addMessage: (type: AlertEnum, message: string) => void;
};