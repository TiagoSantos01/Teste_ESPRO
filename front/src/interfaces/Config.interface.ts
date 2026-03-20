import apis from '../assets/apis.json';
import routes from '../assets/routes.json';
import label from '../assets/label.json';
import icon from '../assets/icons.json';

export interface Config {
  api: typeof apis;
  route: typeof routes;
  label: typeof label;
  icon: typeof icon;
  isDevelopment: boolean;
  webName: string;
  apiUrl: string;
}