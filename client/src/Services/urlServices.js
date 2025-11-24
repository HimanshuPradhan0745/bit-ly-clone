import httpClient from "./httpClient.js";

export const createUrl = async (payload) => {
  try {
    const { data } = await httpClient.post("links", payload);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getUrlStats = async (code) => {
  try {
    const { data } = await httpClient.get(`links/${code}`);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getLinks = async () => {
  try {
    const { data } = await httpClient.get("links");
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteUrlByUrlCode = async (urlCode) => {
  try {
    const { data } = await httpClient.delete(`links/${urlCode}`);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateUrlCode = async (payload) => {
  try {
    const { data } = await httpClient.put(`links/${payload.urlCode}`, payload);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
