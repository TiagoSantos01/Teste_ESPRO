import { createContext, useContext } from 'react';
import { Alert } from '../interfaces/Alert.interface';

export const AlertContext = createContext<Alert | undefined>(undefined);

export const useAlert = (): Alert => {
  const context = useContext(AlertContext);
  if (!context) throw new Error('useAlert must be used within an AlertProvider');
  return context;
};
