// import axios from "axios";
// const API_BASE_URL = process.env.NEXT_PUBLIC_LEAP_API_URL;
// const TOKEN_REFRESH_URL = `${API_BASE_URL}onboarding/token/refresh/`;

// // Function to refresh the token (no Authorization header used here)
// export const refreshToken = async (refreshTokenValue) => {
//   try {
//     const response = await axios.post(
//       TOKEN_REFRESH_URL,
//       { refresh: refreshTokenValue }
//     );
//     return response.data; // Return new token data
//   } catch (error) {
//     console.error("Error refreshing token:", error);
//     throw error;
//   }
// };

// // Create an Axios instance
// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Attach access token on all requests (except refreshToken API)
// axiosInstance.interceptors.request.use(
//   (config) => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       if (accessToken) {
//         config.headers.Authorization = `Bearer ${accessToken}`;
//       }
//     } catch (error) {
//       console.error("Error accessing localStorage:", error);
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor to handle token refresh
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     // Handle 403 - force logout
//     if (error.response && error.response.status === 403) {
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       const role = localStorage.getItem("role");
//       window.location.href = "/";
//     }

//     // Handle 401 - try to refresh token once
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;
//       try {
//         const refreshTokenValue = localStorage.getItem("refreshToken");
//         const newTokenData = await refreshToken(refreshTokenValue);

//         //Store new tokens
//         if (newTokenData.access) {
//           localStorage.setItem("accessToken", newTokenData.access);
//         }
//         if (newTokenData.refresh) {
//           localStorage.setItem("refreshToken", newTokenData.refresh);
//         }

//         //Update retry request with new token
//         originalRequest.headers.Authorization = `Bearer ${newTokenData.access}`;

//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         console.error("Failed to refresh token:", refreshError);
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");
//         const role = localStorage.getItem("role");
//         window.location.href = "/";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_LEAP_API_URL;
const TOKEN_REFRESH_URL = `${API_BASE_URL}onboarding/token/refresh/`;

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Manage refresh state
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const refreshToken = async (refreshTokenValue) => {
  const response = await axios.post(TOKEN_REFRESH_URL, { refresh: refreshTokenValue });
  return response.data;
};

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue this request while refreshing
        return new Promise(function (resolve, reject) {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshTokenValue = localStorage.getItem("refreshToken");
        const newTokenData = await refreshToken(refreshTokenValue);

        localStorage.setItem("accessToken", newTokenData.access);
        if (newTokenData.refresh) {
          localStorage.setItem("refreshToken", newTokenData.refresh);
        }

        processQueue(null, newTokenData.access);

        originalRequest.headers.Authorization = `Bearer ${newTokenData.access}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
