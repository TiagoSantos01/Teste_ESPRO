import { Config } from '../interfaces/Config.interface';
import apis from '../assets/apis.json';
import routes from '../assets/routes.json';
import labels from '../assets/label.json';

export const useConfig = (): Config => {

  const isDevelopment: boolean = import.meta.env.MODE === 'development';
  const api: typeof apis = apis;
  const route: typeof routes = routes;
  const label: typeof labels = labels;
  const webName: string = 'Espro';
 
  return {
    isDevelopment,
    api,
    route,
    label,
    webName
  }
};
