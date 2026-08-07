import { useEffect, useState, useCallback } from "react";
import {
  getMyLeaves,
  applyLeave,
} from "../../services/myLeaveService";
import { getProfile } from "../../services/profileService";

function MyLeave() {
  const [leaves, setLeaves] = useState([]);
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    leave_type: "annual",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const loadLeaves = useCallback(async () => {
    try {
      const [leaveRes, profileRes] = await Promise.all([
        getMyLeaves(),
        getProfile().catch(() => ({ data: null })),
      ]);

      setLeaves(leaveRes.data || []);
      if (profileRes.data) {
        setProfile(profileRes.data);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load leave records.");
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const [leaveRes, profileRes] = await Promise.all([
          getMyLeaves(),
          getProfile().catch(() => ({ data: null })),
        ]);

        if (!ignore) {
          setLeaves(leaveRes.data || []);
          if (profileRes.data) {
            setProfile(profileRes.data);
          }
        }
      } catch (error) {
        if (!ignore) {
          console.error(error);
          alert("Failed to load leave records.");
        }
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];

  const handleStartDateChange = (val) => {
    let newEndDate = form.end_date;
    if (!newEndDate || newEndDate < val) {
      newEndDate = val;
    }
    setForm((prev) => ({
      ...prev,
      start_date: val,
      end_date: newEndDate,
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateDays = () => {
    if (!form.start_date || !form.end_date) return null;
    const start = new Date(form.start_date);
    const end = new Date(form.end_date);
    if (isNaN(start) || isNaN(end) || end < start) return null;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const daysCount = calculateDays();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!form.start_date || !form.end_date) {
      alert("Please select both start date and end date.");
      return;
    }

    if (form.end_date < form.start_date) {
      alert("End date cannot be earlier than start date.");
      return;
    }

    const availableBalance = Number(profile?.annual_leave_balance ?? 0);

    if (form.leave_type === "annual") {
      if (availableBalance <= 0) {
        alert("Your annual leave balance is 0. You cannot submit an annual leave request.");
        return;
      }

      if (daysCount && daysCount > availableBalance) {
        alert(
          `Requested leave duration (${daysCount} days) exceeds remaining annual leave balance (${availableBalance} days).`
        );
        return;
      }
    }

    try {
      setIsSubmitting(true);

      await applyLeave({
        ...form,
        total_days: daysCount || 1,
      });

      alert("Leave request submitted successfully.");

      setForm({
        leave_type: "annual",
        start_date: "",
        end_date: "",
        reason: "",
      });

      loadLeaves();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to submit leave."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in-scale">

      {/* Annual Leave Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Annual Leave</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5 tracking-tight">
              {profile?.total_annual_leave ?? 14} <span className="text-xs font-medium text-slate-400">Days</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-lg">
            AL
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Used Annual Leave</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1.5 tracking-tight">
              {profile?.used_annual_leave ?? 0} <span className="text-xs font-medium text-slate-400">Days</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold text-lg">
            US
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Remaining AL Balance</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1.5 tracking-tight">
              {profile?.annual_leave_balance ?? 14} <span className="text-xs font-medium text-slate-400">Days</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold text-lg">
            BAL
          </div>
        </div>

      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">

        <h2 className="text-lg font-bold mb-5 text-slate-900 tracking-tight">
          Apply for Leave
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Leave Type
            </label>
            <select
              value={form.leave_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  leave_type: e.target.value,
                })
              }
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              required
            >
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="emergency">Emergency Leave</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              min={todayStr}
              value={form.start_date}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              End Date
            </label>
            <input
              type="date"
              min={form.start_date || todayStr}
              value={form.end_date}
              onChange={(e) =>
                setForm({
                  ...form,
                  end_date: e.target.value,
                })
              }
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Reason
            </label>
            <input
              type="text"
              placeholder="Brief reason for leave"
              value={form.reason}
              onChange={(e) =>
                setForm({
                  ...form,
                  reason: e.target.value,
                })
              }
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              required
            />
          </div>

          {daysCount !== null && (
            <div className="col-span-1 sm:col-span-2 bg-blue-50/80 border border-blue-200/80 rounded-xl p-3.5 flex items-center justify-between text-blue-900">
              <span className="font-semibold text-xs uppercase tracking-wider">
                Selected Duration:
              </span>
              <span className="font-extrabold text-xs bg-blue-600 text-white px-3 py-1 rounded-full shadow-sm">
                {daysCount} {daysCount === 1 ? "Day" : "Days"}
              </span>
            </div>
          )}

          <div className="col-span-1 sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all ${
                isSubmitting
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20 active:scale-95"
              }`}
            >
              {isSubmitting ? "Submitting Application..." : "Submit Leave Request"}
            </button>
          </div>

        </form>

      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            My Leave Applications
          </h2>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-4 py-3.5 whitespace-nowrap">Type</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Start</th>
                <th className="px-4 py-3.5 whitespace-nowrap">End</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Days</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    No leave records found.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => {
                  const s = (leave.status || "").toLowerCase();
                  const badgeClass =
                    s === "approved"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                      : s === "rejected"
                      ? "bg-rose-50 text-rose-700 border-rose-200/80"
                      : "bg-amber-50 text-amber-700 border-amber-200/80";

                  return (
                    <tr key={leave.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5 capitalize font-semibold text-slate-900 whitespace-nowrap">
                        {leave.leave_type}
                      </td>

                      <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                        {leave.start_date}
                      </td>

                      <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                        {leave.end_date}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${badgeClass}`}>
                          {leave.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                        {leave.total_days}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default MyLeave;