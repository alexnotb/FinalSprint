import { useState } from 'react';
import Login from './Login';
import Register from './Register';

function Auth({ onAuthSuccess }) {
  const [currentView, setCurrentView] = useState('login');

  const handleLoginClick = () => {
    setCurrentView('login');
  };

  const handleRegisterClick = () => {
    setCurrentView('register');
  };

  const handleAuthSuccess = () => {
    if (onAuthSuccess) onAuthSuccess();
  };

  return (
    <div>
      {currentView === 'login' ? (
        <Login 
          onLoginSuccess={handleAuthSuccess} 
          onRegisterClick={handleRegisterClick} 
        />
      ) : (
        <Register 
          onRegisterSuccess={handleAuthSuccess} 
          onLoginClick={handleLoginClick} 
        />
      )}
    </div>
  );
}

export default Auth;
