import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTodayAttendance, checkIn, checkOut } from "../../services/myAttendanceService";
import { applyLeave } from "../../services/myLeaveService";
import notify from "../../utils/notify";
import {
  ClockIcon,
  CalendarIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  PlusIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";

function QuickActionsWidget({ user, onRefreshData }) {
  // Live Clock
  const [time, setTime] = useState(new Date());

  // Attendance State
  const [attendance, setAttendance] = useState(null);
  const [attLoading, setAttLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Leave Modal State
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leave_type: "annual",
    start_date: "",
    end_date: "",
    reason: ""
  });
  const [submittingLeave, setSubmittingLeave] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      setAttLoading(true);
      const res = await getTodayAttendance();
      if (res?.success) {
        setAttendance(res.data);
      }
    } catch (err) {
      console.error("Failed to load today's attendance:", err);
    } finally {
      setAttLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      const res = await checkIn();
      if (res?.success) {
        setAttendance(res.data);
        if (typeof notify?.success === "function") {
          notify.success("Checked in successfully!");
        } else {
          alert("Checked in successfully!");
        }
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error("Check in error:", err);
      const msg = err.response?.data?.message || "Failed to check in.";
      if (typeof notify?.error === "function") {
        notify.error(msg);
      } else {
        alert(msg);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      const res = await checkOut();
      if (res?.success) {
        setAttendance(res.data);
        if (typeof notify?.success === "function") {
          notify.success("Checked out successfully!");
        } else {
          alert("Checked out successfully!");
        }
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error("Check out error:", err);
      const msg = err.response?.data?.message || "Failed to check out.";
      if (typeof notify?.error === "function") {
        notify.error(msg);
      } else {
        alert(msg);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    if (!leaveForm.start_date || !leaveForm.end_date) {
      if (typeof notify?.error === "function") {
        notify.error("Please select start and end dates.");
      } else {
        alert("Please select start and end dates.");
      }
      return;
    }

    try {
      setSubmittingLeave(true);
      const res = await applyLeave(leaveForm);
      if (res?.success) {
        if (typeof notify?.success === "function") {
          notify.success("Leave request submitted successfully!");
        } else {
          alert("Leave request submitted successfully!");
        }
        setShowLeaveModal(false);
        setLeaveForm({ leave_type: "annual", start_date: "", end_date: "", reason: "" });
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error("Leave submit error:", err);
      const msg = err.response?.data?.message || "Failed to submit leave request.";
      if (typeof notify?.error === "function") {
        notify.error(msg);
      } else {
        alert(msg);
      }
    } finally {
      setSubmittingLeave(false);
    }
  };

  const formatTimeString = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Action Widget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Real-time Attendance & Clocking Widget */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <ClockIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Attendance Clock</h3>
                <p className="text-xs text-slate-500 font-mono">
                  {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </p>
              </div>
            </div>

            {/* Attendance Status Badge */}
            {attLoading ? (
              <span className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            ) : attendance?.clock_out ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                Completed
              </span>
            ) : attendance?.clock_in ? (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                Clocked In
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Not Checked In
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 py-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Check In:</span>
              <span className="font-bold text-slate-800 text-sm">
                {attendance?.clock_in ? formatTimeString(attendance.clock_in) : "--:--"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Check Out:</span>
              <span className="font-bold text-slate-800 text-sm">
                {attendance?.clock_out ? formatTimeString(attendance.clock_out) : "--:--"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            {!attendance?.clock_in ? (
              <button
                onClick={handleCheckIn}
                disabled={actionLoading || attLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span>{actionLoading ? "Processing..." : "Clock In Now"}</span>
              </button>
            ) : !attendance?.clock_out ? (
              <button
                onClick={handleCheckOut}
                disabled={actionLoading || attLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
              >
                <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                <span>{actionLoading ? "Processing..." : "Clock Out Now"}</span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 px-4 bg-slate-100 text-slate-400 font-medium text-xs rounded-xl cursor-not-allowed"
              >
                ✓ Today's Shift Finished
              </button>
            )}
          </div>
        </div>

        {/* 2. Quick Leave Request Widget */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Leave Application</h3>
              <p className="text-xs text-slate-500">Need time off work?</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/50 p-3 rounded-2xl border border-amber-100">
            Submit a new leave request (Annual, Sick, Emergency) instantly for manager approval.
          </p>

          <button
            onClick={() => setShowLeaveModal(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Apply for Leave</span>
          </button>
        </div>

        {/* 3. ESS Quick Shortcuts Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <ClipboardDocumentCheckIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Quick ESS Portal</h3>
              <p className="text-xs text-slate-500">Direct self service links</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              to="/profile"
              className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-medium text-slate-700 border border-slate-100 transition"
            >
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span>My Profile</span>
            </Link>

            <Link
              to="/my-attendance"
              className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-medium text-slate-700 border border-slate-100 transition"
            >
              <MapPinIcon className="w-4 h-4 text-slate-400" />
              <span>Attendance History</span>
            </Link>

            <Link
              to="/my-leave"
              className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-medium text-slate-700 border border-slate-100 transition"
            >
              <DocumentTextIcon className="w-4 h-4 text-slate-400" />
              <span>My Leaves</span>
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/audit-logs"
                className="flex items-center gap-2 p-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-medium border border-purple-100 transition"
              >
                <span className="text-sm">📋</span>
                <span>Audit Logs</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Quick Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Apply for Leave</h3>
                <p className="text-xs text-slate-400 mt-0.5">Submit your request to HR & Management</p>
              </div>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="text-slate-400 hover:text-white text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 text-xs uppercase mb-1">
                  Leave Type
                </label>
                <select
                  value={leaveForm.leave_type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leave_type: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="emergency">Emergency Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 text-xs uppercase mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={leaveForm.start_date}
                    onChange={(e) => setLeaveForm({ ...leaveForm, start_date: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 text-xs uppercase mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={leaveForm.end_date}
                    onChange={(e) => setLeaveForm({ ...leaveForm, end_date: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 text-xs uppercase mb-1">
                  Reason / Notes
                </label>
                <textarea
                  rows="3"
                  placeholder="State reason for leave request..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingLeave}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-sm disabled:opacity-50"
                >
                  {submittingLeave ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuickActionsWidget;
