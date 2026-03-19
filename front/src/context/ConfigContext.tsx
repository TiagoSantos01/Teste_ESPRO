import {
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { Config } from '../interfaces/Config.interface';
import { useConfig } from '../hooks/useConfig';

const ConfigContext = createContext<Config | null>(null);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ConfigContext.Provider value={useConfig()}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfigContext = (): Config => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfigContext must be used within a ConfigProvider');
  }
  return context;
};