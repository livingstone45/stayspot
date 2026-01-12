import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.js';
import { ThemeProvider } from './contexts/ThemeContext';
import AppRouter from './routes';
import './index.css';

const App = () => {
  return (
    <BrowserRouter basename="/stayspot/">
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
