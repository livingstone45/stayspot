import React from 'react';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.js';
import { ThemeProvider } from './contexts/ThemeContext';
import AppRouter from './routes';
import './index.css';

const App = () => {
  return (
    <HashRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </HashRouter>
  );
};

export default App;
