import apis from '../assets/apis.json';
import routes from '../assets/routes.json';
import label from '../assets/label.json';

export interface Config {
  api: typeof apis;
  route: typeof routes;
  label: typeof label;
  isDevelopment: boolean;
  webName: string;
}