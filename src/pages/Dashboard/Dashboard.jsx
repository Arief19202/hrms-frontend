import { useEffect, useState } from "react";
import { ArrowPathIcon, SparklesIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import api from "../../api/axios";

import DashboardStats from "../../components/dashboard/DashboardStats";
import RecentLeaves from "../../components/dashboard/RecentLeaves";
import QuickActionsWidget from "../../components/dashboard/QuickActionsWidget";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

function Dashboard() {
  const [statistics, setStatistics] = useState({
    employees: 0,
    departments: 0,
    attendance: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
    recentLeaves: [],
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fetchDashboard = async () => {
    try {
      setRefreshing(true);
      const response = await api.get("/dashboard", {
        params: { timeZone: getTimeZone() }
      });
      setStatistics(response.data.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const response = await api.get("/dashboard", {
          params: { timeZone: getTimeZone() }
        });
        if (!ignore) {
          setStatistics(response.data.data);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setError("Failed to load dashboard statistics.");
        }
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
        <ExclamationTriangleIcon className="w-6 h-6 shrink-0 text-rose-500 mt-0.5" />
        <div>
          <h3 className="font-semibold text-base">Unable to sync metrics</h3>
          <p className="text-sm text-rose-600 mt-1">{error}</p>
          <button
            onClick={fetchDashboard}
            className="mt-3 text-xs font-semibold px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-medium mb-3">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Real-time Workspace Overview</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              Welcome back, {user?.name || "Team Admin"} 👋
            </h1>

            <p className="text-slate-300 text-sm sm:text-base mt-1.5 max-w-xl">
              Here is what's happening across employees, attendance logs, and leave requests today.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            disabled={refreshing}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border border-white/20 px-5 py-2.5 rounded-xl text-sm font-semibold backdrop-blur-md transition-all shadow-md disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "Refreshing..." : "Sync Metrics"}</span>
          </button>
        </div>
      </div>

      {/* Quick Action Interactive Bar (Clock In/Out, Quick Leave, Shortcuts) */}
      <QuickActionsWidget user={user} onRefreshData={fetchDashboard} />

      {/* Stats Cards Grid */}
      <DashboardStats statistics={statistics} />

      {/* Recent Activity Table */}
      <RecentLeaves leaves={statistics.recentLeaves} />
    </div>
  );
}

export default Dashboard;