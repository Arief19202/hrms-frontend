import api from "../api/axios";

export const getTodayAttendance = async () => {
  const { data } = await api.get("/attendance/today");
  return data;
};

export const checkIn = async () => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data } = await api.post("/attendance/check-in", { timeZone });
  return data;
};

export const checkOut = async () => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data } = await api.post("/attendance/check-out", { timeZone });
  return data;
};

export const getMyAttendanceHistory = async () => {
  const { data } = await api.get("/attendance/my");
  return data;
};