import api from "../api/axios";

export const getTodayAttendance = async () => {
  const { data } = await api.get("/attendance/today");
  return data;
};

export const checkIn = async () => {
  const { data } = await api.post("/attendance/check-in");
  return data;
};

export const checkOut = async () => {
  const { data } = await api.post("/attendance/check-out");
  return data;
};

export const getMyAttendanceHistory = async () => {
  const { data } = await api.get("/attendance/my");
  return data;
};