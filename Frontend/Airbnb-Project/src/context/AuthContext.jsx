// Import React Context API and hooks
import { createContext, useState, useContext } from 'react';

// Create the authentication context
const AuthContext = createContext();

// Authentication provider component
// Makes authentication data available to all child components
export const AuthProvider = ({ children }) => {

  // Retrieve the saved user from localStorage
  const savedUser = localStorage.getItem('user');

  // Store the logged-in user's information
  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);

  // Store the JWT authentication token
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Logs the user in by saving their details and token
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);

    // Save login details so they persist after refreshing the page
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logs the user out by clearing state and localStorage
  const logout = () => {
    setUser(null);
    setToken(null);

    // Remove stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Provide authentication data and functions to the application
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook used to access the authentication context
export const useAuth = () => useContext(AuthContext);

export const useAuth = () => useContext(AuthContext);
