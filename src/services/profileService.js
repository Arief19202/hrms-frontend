import api from "../api/axios";

export const getProfile = async () => {
  const { data } = await api.get("/employees/profile");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.patch("/employees/profile", payload);
  return data;
};