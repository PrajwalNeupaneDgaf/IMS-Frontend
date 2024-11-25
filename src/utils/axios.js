import axios from 'axios';

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: 'https://ims-college-project.netlify.app/', 
 // baseURL: 'http://localhost:5000/api', 

  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add token to headers (for authenticated requests)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach token to each request
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
