import httpClient from "./httpClient.js";
import { getAuthUser } from "../util/useAuth.js";

export const getUserById = async (id) => {
  const userId = id || getAuthUser()?.id;
  try {
    const { data } = await httpClient.get(`user/${userId}`);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateUser = async (payload) => {
  try {
    const { data } = await httpClient.put(`user/${payload.id}`, payload);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
