import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Alert } from 'react-bootstrap';
import { AlertContext } from './context/AlertContext';
import type { Message } from './interfaces/Message.interface';
import { AlertEnum } from './enum/AlertEnum.enum';
import { ConfigProvider } from './context/ConfigContext';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const addMessage = (type: AlertEnum, message: string) => {
    const id = Date.now();
    setMessages(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setMessages(prev => prev.slice(1));
    }, 5000);
  };

  return (
    <AlertContext.Provider value={{ addMessage }}>
      <div className='position-absolute block-alerts end-0' style={{ zIndex: '99999999999999999999' }}>
        <div className='top-0 mt-3'>
          {messages.map(data => (
            <Alert key={data.id} variant={data.type}>
              {data.message}
            </Alert>
          ))}
        </div>
      </div>
      <Router>
          <ConfigProvider>
            <AppRoutes />
          </ConfigProvider>
      </Router>
    </AlertContext.Provider>

  );
};

export default App;
