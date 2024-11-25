import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from '../utils/axios'; // Import the axios instance

const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is authenticated by the presence of a token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/auth/profile')
      .then((response) => {
        const user = response.data
        setUser(response.data);
        if(user.role=='employee' || user.role=='admin'){
          setIsAuthenticated(true);
        }else{
          setIsAuthenticated(false);
        }
        
      }).catch(()=>{
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      })
     
    } else {
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      const { data } = await axios.post('/auth/login', credentials); // Use axiosInstance here
      localStorage.setItem('token', data.token); // Store the token in localStorage
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role }); // Store user info
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    try {
      const { data } = await axios.post('/auth/register', userData); // Use axiosInstance here
      localStorage.setItem('token', data.token); // Store the token in localStorage
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role }); // Store user info
      setIsAuthenticated(true); // Mark as authenticated
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    setUser(null); // Clear user data
    setIsAuthenticated(false); // Mark as not authenticated
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
