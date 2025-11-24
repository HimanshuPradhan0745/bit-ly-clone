import axios from "axios";
import { handleRefreshToken } from "./authServices.js";

// Determine API base URL
const viteApi = import.meta?.env?.VITE_API_BASE_URL;
const sameOriginApi = typeof window !== "undefined" ? `${window.location.origin}/api/` : "/api/";
axios.defaults.baseURL = (viteApi && viteApi.trim()) || sameOriginApi || "https://bit-ly-clone.onrender.com/api/";
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  function (config) {
    config.headers["authorization"] = `Bearer ${localStorage.getItem(
      "accessToken"
    )}`;
    config.headers["refresh_token"] = localStorage.getItem("refreshToken") || "";

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    console.log("success status request", response);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest.url.includes("refresh-token")
    ) {
      return Promise.reject(error);
    } else if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      await handleRefreshToken();

      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axios;
