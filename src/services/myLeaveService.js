import api from "../api/axios";

export const getMyLeaves = async () => {
  const { data } = await api.get("/leaves/my");
  return data;
};

export const applyLeave = async (payload) => {
  const { data } = await api.post("/leaves/request", payload);
  return data;
};