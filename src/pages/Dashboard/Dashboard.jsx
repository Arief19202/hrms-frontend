import { useEffect, useState } from "react";
import api from "../../api/axios";

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

  const [error, setError] = useState("");

  const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard", {
        params: { timeZone: getTimeZone() }
      });
      setStatistics(response.data.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard.");
    } finally {
      setLoading(false);
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
          setError("Failed to load dashboard.");
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
      <div className="flex justify-center items-center h-80">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 rounded-lg p-5">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-gray-500 text-sm sm:text-base">
            Welcome back to HR Management System
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Refresh
        </button>

      </div>

      <DashboardStats statistics={statistics} />

      <RecentLeaves
        leaves={statistics.recentLeaves}
      />

    </div>
  );
}

export default Dashboard;