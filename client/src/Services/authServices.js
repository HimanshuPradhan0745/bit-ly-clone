import httpClient from "./httpClient.js";
import snackBarStore from "../components/common/Snackbar/store/snackBarStore.js";

export const signup = async (payload, redirectTo) => {
  try {
    const { data } = await httpClient.post("user", payload);
    storeAccessTokenToLocal(data.accessToken);
    storeRefreshTokenToLocal(data.refreshToken);
    redirectTo("/dashboard");
    snackBarStore.showSnackBar("Signup success", "success");
  } catch (error) {
    snackBarStore.showSnackBar(`Problem in Singup: ${error.response?.data}`, "error");
    console.log(error);
  }
};

export const login = async (payload, redirectTo) => {
  try {
    const { data } = await httpClient.post("user/login", payload);
    storeAccessTokenToLocal(data.accessToken);
    storeRefreshTokenToLocal(data.refreshToken);
    redirectTo("/dashboard");
    snackBarStore.showSnackBar("Login success", "success");
  } catch (error) {
    snackBarStore.showSnackBar(`Problem in login: ${error.response?.data}`, "error");
    console.log(error);
  }
};

export const forgotPassword = async (email) => {
  try {
    await httpClient.post("auth/forgot-password", { email });
    snackBarStore.showSnackBar("Instruction sent successfully", "success");
    return true;
  } catch (error) {
    snackBarStore.showSnackBar(`Problem: ${error.response?.data}`, "error");
    console.log(error);
    return false;
  }
};

export const verifyToken = async (token) => {
  try {
    await httpClient.post("auth/verify-token", { token });
    return true;
  } catch (error) {
    snackBarStore.showSnackBar(`Problem: ${error.response?.data}`, "error");
    console.log(error);
    return false;
  }
};

export const resetPassword = async (token, password) => {
  try {
    await httpClient.post("auth/reset-password", { token, password });
    snackBarStore.showSnackBar("Reset successfully", "success");
    return true;
  } catch (error) {
    snackBarStore.showSnackBar(`Prblem: ${error.response?.data}`, "error");
    console.log(error);
    return false;
  }
};

export const handleRefreshToken = async () => {
  try {
    const { data } = await httpClient.get("auth/refresh-token");
    storeAccessTokenToLocal(data.accessToken);
    storeRefreshTokenToLocal(data.refreshToken);
  } catch (error) {
    console.log(error);
  }
};

export const logout = (redirectTo) => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  redirectTo("/login");
};

const storeAccessTokenToLocal = (accessToken) =>
  localStorage.setItem("accessToken", accessToken);
const storeRefreshTokenToLocal = (refreshToken) =>
  localStorage.setItem("refreshToken", refreshToken);
