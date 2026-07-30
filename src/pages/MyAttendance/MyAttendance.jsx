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
    let ignore = false;
    const load = async () => {
      try {
        const [todayRes, historyRes] = await Promise.all([
          getTodayAttendance(),
          getMyAttendanceHistory().catch(() => ({ data: [] })),
        ]);
        if (!ignore) {
          setAttendance(todayRes.data);
          setHistory(historyRes.data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

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
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Date & Live Clock Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-4 sm:p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-blue-200 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            Today's Date
          </p>
          <h2 className="text-xl sm:text-2xl font-bold mt-1">
            {currentTime.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <div className="mt-2 flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg w-fit text-xs font-medium">
            <span>🏢 Operating Hours:</span>
            <span className="font-bold text-yellow-300">8:00 AM – 5:00 PM</span>
          </div>
        </div>
        <div className="w-full sm:w-auto bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl text-center border border-white/20">
          <p className="text-blue-200 text-xs uppercase tracking-wider font-medium">
            Current Time
          </p>
          <p className="text-2xl sm:text-3xl font-mono font-bold mt-1">
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 sm:p-8">

        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
          Attendance Record
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-emerald-900 text-sm sm:text-base">
                  Clock In Time (8:00 AM)
                </h3>
                <span className="text-xl">📥</span>
              </div>
              <p className="text-2xl sm:text-3xl font-mono font-bold text-emerald-700">
                {formatTime(attendance?.check_in)}
              </p>
            </div>
            {attendance?.check_in && (
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                  Recorded
                </span>
                {attendance?.status === "late" ? (
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                    ⚠️ Late Clock-In
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-200 px-3 py-1 rounded-full">
                    ✅ On Time
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-rose-900 text-sm sm:text-base">
                  Clock Out Time (5:00 PM)
                </h3>
                <span className="text-xl">📤</span>
              </div>
              <p className="text-2xl sm:text-3xl font-mono font-bold text-rose-700">
                {formatTime(attendance?.check_out)}
              </p>
            </div>
            {attendance?.check_out && (
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
                  Recorded
                </span>
                {attendance?.notes?.includes("Early Leave") ? (
                  <span className="text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                    ⚠️ Early Leave
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-200 px-3 py-1 rounded-full">
                    ✅ Shift Completed
                  </span>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Action Buttons & Attendance Completed State */}
        <div className="mt-8">
          {isCompleted ? (
            <div className="bg-emerald-100 border border-emerald-300 rounded-xl p-4 text-center">
              <span className="inline-flex items-center gap-2 text-emerald-800 font-bold text-base sm:text-lg">
                ✅ Attendance Completed
              </span>
              <p className="text-emerald-600 text-xs sm:text-sm mt-1">
                You have completed both Clock In and Clock Out for today.
              </p>
            </div>
          ) : !hasCheckedIn ? (
            <button
              onClick={handleCheckIn}
              disabled={actionLoading}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold transition-all shadow-md ${
                actionLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg active:scale-95"
              }`}
            >
              {actionLoading ? "Processing Clock In..." : "Clock In Now"}
            </button>
          ) : (
            <button
              onClick={handleCheckOut}
              disabled={actionLoading}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold transition-all shadow-md ${
                actionLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-rose-600 hover:bg-rose-700 text-white hover:shadow-lg active:scale-95"
              }`}
            >
              {actionLoading ? "Processing Clock Out..." : "Clock Out Now"}
            </button>
          )}
        </div>

      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-8">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 flex items-center justify-between">
          <span>Attendance History</span>
          <span className="text-xs font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {history.length} Record{history.length === 1 ? "" : "s"}
          </span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-600 text-sm">
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Date</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Clock In Time</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Clock Out Time</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">
                    No past attendance records found.
                  </td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50 text-sm">
                    <td className="py-3 px-4 font-medium text-gray-800 whitespace-nowrap">
                      {record.attendance_date}
                    </td>
                    <td className="py-3 px-4 text-emerald-700 font-mono whitespace-nowrap">
                      {formatTime(record.check_in)}
                    </td>
                    <td className="py-3 px-4 text-rose-700 font-mono whitespace-nowrap">
                      {formatTime(record.check_out)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="capitalize px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
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