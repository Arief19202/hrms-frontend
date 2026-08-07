import { useEffect, useState, useCallback } from "react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import {
  getTodayAttendance,
  getMyAttendanceHistory,
  checkIn,
  checkOut,
} from "../../services/myAttendanceService";

function MyAttendance() {
  const [attendance, setAttendance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const formatTime = (timeStr) => {
    if (!timeStr) return "-";
    try {
      if (timeStr.includes("T") || timeStr.includes("-")) {
        const d = new Date(timeStr);
        if (!isNaN(d.getTime())) {
          return d.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          });
        }
      }
      const parts = timeStr.split(":");
      if (parts.length >= 2) {
        const date = new Date();
        date.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0);
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }
      return timeStr;
    } catch {
      return timeStr;
    }
  };

  const loadAttendance = useCallback(async () => {
    try {
      const [todayRes, historyRes] = await Promise.all([
        getTodayAttendance(),
        getMyAttendanceHistory().catch(() => ({ data: [] })),
      ]);
      setAttendance(todayRes.data);
      setHistory(historyRes.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime((prevTime) => {
        if (prevTime.getDate() !== now.getDate()) {
          loadAttendance();
        }
        return now;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loadAttendance]);

  const [actionLoading, setActionLoading] = useState(false);

  const handleCheckIn = async () => {
    if (actionLoading || attendance?.check_in) return;
    try {
      setActionLoading(true);
      await checkIn();

      alert("Clock In Successful");

      loadAttendance();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Clock In Failed"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (actionLoading || !attendance?.check_in || attendance?.check_out) return;
    try {
      setActionLoading(true);
      await checkOut();

      alert("Clock Out Successful");

      loadAttendance();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Clock Out Failed"
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const hasCheckedIn = !!attendance?.check_in;
  const hasCheckedOut = !!attendance?.check_out;
  const isCompleted = hasCheckedIn && hasCheckedOut;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in-scale">

      {/* Date & Live Clock Header Card */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 rounded-2xl shadow-xl p-5 sm:p-7 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">
            Today's Date
          </p>
          <h2 className="text-xl sm:text-2xl font-extrabold mt-1 tracking-tight">
            {currentTime.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <div className="mt-2.5 flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-xl w-fit text-xs font-medium border border-white/20">
            <span>Operating Hours:</span>
            <span className="font-bold text-amber-300">8:00 AM – 5:00 PM</span>
          </div>
        </div>

        <div className="relative z-10 w-full sm:w-auto bg-white/10 backdrop-blur-md px-6 py-3.5 rounded-2xl text-center border border-white/20">
          <p className="text-blue-200 text-xs uppercase tracking-wider font-semibold">
            Live Clock
          </p>
          <p className="text-2xl sm:text-3xl font-mono font-extrabold mt-1 tracking-tight">
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <h1 className="text-xl font-bold mb-6 text-slate-900 tracking-tight">
          Daily Punch Card
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-emerald-900 text-xs uppercase tracking-wider">
                  Clock In (8:00 AM)
                </h3>
                <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold">IN</span>
              </div>
              <p className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-700 mt-2">
                {formatTime(attendance?.check_in)}
              </p>
            </div>
            {attendance?.check_in && (
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full">
                  Recorded
                </span>
                {attendance?.status === "late" ? (
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full">
                    Late Clock-In
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full">
                    On Time
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-rose-900 text-xs uppercase tracking-wider">
                  Clock Out (5:00 PM)
                </h3>
                <span className="p-2 bg-rose-100 text-rose-700 rounded-xl text-xs font-bold">OUT</span>
              </div>
              <p className="text-2xl sm:text-3xl font-mono font-extrabold text-rose-700 mt-2">
                {formatTime(attendance?.check_out)}
              </p>
            </div>
            {attendance?.check_out && (
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-rose-700 bg-rose-100 border border-rose-200 px-3 py-1 rounded-full">
                  Recorded
                </span>
                {attendance?.notes?.includes("Early Leave") ? (
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full">
                    Early Leave
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full">
                    Shift Completed
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons & Attendance Completed State */}
        <div className="mt-8">
          {isCompleted ? (
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 text-center">
              <span className="inline-flex items-center gap-2 text-emerald-800 font-bold text-base">
                Attendance Completed
              </span>
              <p className="text-emerald-600 text-xs mt-1">
                Both Clock In and Clock Out have been recorded for today.
              </p>
            </div>
          ) : !hasCheckedIn ? (
            <button
              onClick={handleCheckIn}
              disabled={actionLoading}
              className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
                actionLoading
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20 active:scale-95"
              }`}
            >
              {actionLoading ? "Processing Clock In..." : "Clock In Now"}
            </button>
          ) : (
            <button
              onClick={handleCheckOut}
              disabled={actionLoading}
              className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
                actionLoading
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-500/20 active:scale-95"
              }`}
            >
              {actionLoading ? "Processing Clock Out..." : "Clock Out Now"}
            </button>
          )}
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
          <span>Attendance History</span>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {history.length} Record{history.length === 1 ? "" : "s"}
          </span>
        </h2>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 whitespace-nowrap">Date</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Clock In</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Clock Out</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400">
                    No past attendance records found.
                  </td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {record.attendance_date}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-600 font-mono font-semibold whitespace-nowrap">
                      {formatTime(record.check_in)}
                    </td>
                    <td className="py-3.5 px-4 text-rose-600 font-mono font-semibold whitespace-nowrap">
                      {formatTime(record.check_out)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="capitalize inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                        {record.status || "present"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default MyAttendance;