import { useEffect, useState } from "react";
import api from "../../api/axios";
import { ArrowPathIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import DashboardStats from "../../components/dashboard/DashboardStats";
import RecentLeaves from "../../components/dashboard/RecentLeaves";

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

  const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fetchDashboard = async () => {
    setRefreshing(true);
    try {
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
    return (
      <div className="flex flex-col justify-center items-center h-80 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-600 border-t-transparent shadow-md"></div>
        <p className="text-sm font-medium text-slate-500">Loading metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-5 flex items-center gap-3">
        <ExclamationTriangleIcon className="w-6 h-6 shrink-0" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in-scale">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            System Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time HR analytics & employee stats
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          disabled={refreshing}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 px-4 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all active:scale-95 disabled:opacity-50"
        >
          <ArrowPathIcon className={`w-4 h-4 ${refreshing ? "animate-spin text-blue-600" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      <DashboardStats statistics={statistics} />

      <RecentLeaves
        leaves={statistics.recentLeaves || []}
      />
    </div>
  );
}

export default Dashboard;