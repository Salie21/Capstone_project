// Import React Context API and hooks
import { useState } from 'react';
import { AuthContext } from './AuthContextValue';


// Authentication provider component
// Makes authentication data available to all child components
export const AuthProvider = ({ children }) => {
  const savedUser = localStorage.getItem('user');
  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Log the user into the application
  // Save the user details and token in both state and local storage
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

   // Log the user out of the application
  // Clear the authentication data from state and local storage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
