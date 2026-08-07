import { useEffect, useState, useCallback } from "react";
import notify from "../../utils/notify";
import {
  getMyLeaves,
  applyLeave,
} from "../../services/myLeaveService";
import { getProfile } from "../../services/profileService";
import {
  CalendarDaysIcon,
  ClockIcon,
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  PaperAirplaneIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

function MyLeave() {
  const [leaves, setLeaves] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    leave_type: "annual",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadLeaves = useCallback(async () => {
    try {
      setLoading(true);
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
      if (typeof notify?.error === "function") {
        notify.error("Failed to load leave records.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

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
      if (typeof notify?.warning === "function") {
        notify.warning("Please select both start date and end date.");
      } else {
        alert("Please select both start date and end date.");
      }
      return;
    }

    if (form.end_date < form.start_date) {
      if (typeof notify?.warning === "function") {
        notify.warning("End date cannot be earlier than start date.");
      } else {
        alert("End date cannot be earlier than start date.");
      }
      return;
    }

    const availableBalance = Number(profile?.annual_leave_balance ?? 0);

    if (form.leave_type === "annual") {
      if (availableBalance <= 0) {
        if (typeof notify?.warning === "function") {
          notify.warning("Your annual leave balance is 0. You cannot submit an annual leave request.");
        } else {
          alert("Your annual leave balance is 0.");
        }
        return;
      }

      if (daysCount && daysCount > availableBalance) {
        const msg = `Requested leave duration (${daysCount} days) exceeds remaining annual leave balance (${availableBalance} days).`;
        if (typeof notify?.warning === "function") {
          notify.warning(msg);
        } else {
          alert(msg);
        }
        return;
      }
    }

    try {
      setIsSubmitting(true);

      await applyLeave({
        ...form,
        total_days: daysCount || 1,
      });

      if (typeof notify?.success === "function") {
        notify.success("Leave request submitted successfully.");
      } else {
        alert("Leave request submitted successfully.");
      }

      setForm({
        leave_type: "annual",
        start_date: "",
        end_date: "",
        reason: "",
      });

      loadLeaves();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to submit leave.";
      if (typeof notify?.error === "function") {
        notify.error(msg);
      } else {
        alert(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Leaves List
  const filteredLeaves = leaves.filter((leave) => {
    const matchesStatus = filterStatus === "ALL" || leave.status?.toLowerCase() === filterStatus.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      leave.leave_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.start_date?.includes(searchQuery) ||
      leave.end_date?.includes(searchQuery);

    return matchesStatus && matchesQuery;
  });

  // Calculate Metrics
  const totalAnnual = profile?.total_annual_leave ?? 14;
  const usedAnnual = profile?.used_annual_leave ?? 0;
  const remainingAnnual = profile?.annual_leave_balance ?? (totalAnnual - usedAnnual);
  const pendingCount = leaves.filter((l) => l.status === "pending").length;
  const usagePercentage = Math.min(Math.round((usedAnnual / (totalAnnual || 14)) * 100), 100);

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircleIcon className="w-3.5 h-3.5" />
          Approved
        </span>
      );
    }
    if (s === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircleIcon className="w-3.5 h-3.5" />
          Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
        <ClockIcon className="w-3.5 h-3.5" />
        Pending Review
      </span>
    );
  };

  const getLeaveTypeBadge = (type) => {
    switch (type?.toLowerCase()) {
      case "annual":
        return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">🌴 Annual</span>;
      case "sick":
        return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">🏥 Sick</span>;
      case "emergency":
        return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">🚨 Emergency</span>;
      default:
        return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">💳 Unpaid</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Banner & Quota Overview */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-medium mb-3">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Employee Self Service</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              My Leave Portal 🌴
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Track your annual leave entitlement, submit time-off requests, and monitor application progress.
            </p>
          </div>

          {/* Leave Quota Usage Bar */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 min-w-[260px] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300 uppercase tracking-wider">Annual Leave Quota</span>
              <span className="text-emerald-400 font-bold">{remainingAnnual} / {totalAnnual} Days Free</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-indigo-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${100 - usagePercentage}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 text-right">{usagePercentage}% quota consumed this year</p>
          </div>
        </div>
      </div>

      {/* Modern Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Annual */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Entitlement</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1 font-heading">
              {totalAnnual} <span className="text-xs font-normal text-slate-400">Days / Year</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-xl font-bold">
            📅
          </div>
        </div>

        {/* Used Days */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Used Leave</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1 font-heading">
              {usedAnnual} <span className="text-xs font-normal text-slate-400">Days</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center text-xl font-bold">
            ⏳
          </div>
        </div>

        {/* Remaining AL */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available AL Balance</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1 font-heading">
              {remainingAnnual} <span className="text-xs font-normal text-slate-400">Days</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-xl font-bold">
            🌴
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Review</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-1 font-heading">
              {pendingCount} <span className="text-xs font-normal text-slate-400">Requests</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center text-xl font-bold">
            📝
          </div>
        </div>
      </div>

      {/* Main Content Layout: Apply Form + Leave Records Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Apply Leave Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 h-fit">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <CalendarDaysIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Apply for Leave</h2>
              <p className="text-xs text-slate-500">Fill in form details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {/* Leave Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Leave Type
              </label>
              <select
                value={form.leave_type}
                onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                required
              >
                <option value="annual">🌴 Annual Leave</option>
                <option value="sick">🏥 Sick Leave</option>
                <option value="emergency">🚨 Emergency Leave</option>
                <option value="unpaid">💳 Unpaid Leave</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                min={todayStr}
                value={form.start_date}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                End Date
              </label>
              <input
                type="date"
                min={form.start_date || todayStr}
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                required
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Reason / Details
              </label>
              <textarea
                rows="3"
                placeholder="State your reason for leave..."
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                required
              />
            </div>

            {/* Duration Display Box */}
            {daysCount !== null && (
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between text-indigo-900">
                <span className="text-xs font-semibold uppercase">Total Duration:</span>
                <span className="text-xs font-extrabold px-3 py-1 bg-indigo-600 text-white rounded-full">
                  {daysCount} {daysCount === 1 ? "Day" : "Days"}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl transition shadow-md disabled:opacity-50"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
              <span>{isSubmitting ? "Submitting..." : "Submit Application"}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Leave Records & History Table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Table Header & Search Filter Bar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <div>
                <h2 className="font-bold text-slate-900 text-base">My Leave Applications</h2>
                <p className="text-xs text-slate-500">History of submitted requests</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search Box */}
              <div className="relative flex-1 sm:w-48">
                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search leave..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6">Type</th>
                    <th className="py-3.5 px-4">Start Date</th>
                    <th className="py-3.5 px-4">End Date</th>
                    <th className="py-3.5 px-4">Duration</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Reason</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-sm">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="py-4 px-6"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                        <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                        <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                        <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-12"></div></td>
                        <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                        <td className="py-4 px-4 text-right"><div className="h-4 bg-slate-200 rounded w-28 ml-auto"></div></td>
                      </tr>
                    ))
                  ) : filteredLeaves.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <span className="text-4xl">🏝️</span>
                          <p className="font-semibold text-slate-700">No leave records found</p>
                          <p className="text-xs text-slate-400">Your submitted leave requests will appear here.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredLeaves.map((leave) => (
                      <tr key={leave.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                          {getLeaveTypeBadge(leave.leave_type)}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs text-slate-700">
                          {leave.start_date}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs text-slate-700">
                          {leave.end_date}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-bold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                            {leave.total_days} {leave.total_days === 1 ? "day" : "days"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {getStatusBadge(leave.status)}
                        </td>

                        <td className="py-3.5 px-4 text-right max-w-xs truncate text-xs text-slate-600 font-medium">
                          {leave.reason || "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyLeave;