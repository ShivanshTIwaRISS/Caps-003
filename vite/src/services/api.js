// import axios from 'axios';
// import ENDPOINT from '../constants';

// const api = axios.create({
//   baseURL: ENDPOINT
// });

// api.interceptors.request.use((config) => {

//   const token = localStorage.getItem('accessToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (error) => Promise.reject(error));

// export default api;
import axios from "axios";
import ENDPOINT from "../constants";

const api = axios.create({
  baseURL: ENDPOINT,
  withCredentials: false, // Render does NOT use cookies
});

// Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
