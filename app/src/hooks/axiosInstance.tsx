import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("user_token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("user_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user_data");

          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
