import axios from "axios";
import { API_URL } from "./constants";
import { useAuthStore } from "../store/useAuthStore";

// Create the main Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
});

// Request Interceptor: Attach Access Token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().tokens.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token expiration and refresh
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const { tokens, setTokens, logout } = useAuthStore.getState();

//       if (!tokens.refreshToken) {
//         logout();
//         return Promise.reject(error);
//       }

//       try {
//         const res = await axios.post(
//           `${API_URL}/auth/refresh-accesstoken`,
//           { refreshToken: tokens.refreshToken },
//           { withCredentials: true }
//         );

//         const newAccessToken = res.data?.accessToken;
//         const newRefreshToken = res.data?.refreshToken;

//         if (newAccessToken && newRefreshToken) {
//           setTokens({
//             accessToken: newAccessToken,
//             refreshToken: newRefreshToken,
//           });

//           // Retry the original request with new access token
//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//           return axiosInstance(originalRequest);
//         } else {
//           logout();
//           return Promise.reject(error);
//         }
//       } catch (refreshError) {
//         logout();
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
