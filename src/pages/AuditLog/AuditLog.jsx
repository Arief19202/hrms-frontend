import { useState, useEffect, useCallback } from "react";
import { getAuditLogs, getAuditLogStats } from "../../services/auditService";

function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalLogs: 0,
    todayCount: 0,
    uniqueUsersCount: 0,
    entityBreakdown: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [selectedEntity, setSelectedEntity] = useState("ALL");
  const [selectedAction, setSelectedAction] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    totalRecords: 0,
    totalPages: 1
  });

  // Modal for Viewing Log Payload Details
  const [selectedLog, setSelectedLog] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit,
        search: search.trim() || undefined,
        entity: selectedEntity !== "ALL" ? selectedEntity : undefined,
        action: selectedAction !== "ALL" ? selectedAction : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      };

      const [logData, statsData] = await Promise.all([
        getAuditLogs(params),
        getAuditLogStats()
      ]);

      if (logData.success) {
        setLogs(logData.data || []);
        if (logData.pagination) {
          setPagination(logData.pagination);
        }
      }

      if (statsData?.success && statsData?.data) {
        setStats(statsData.data);
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
      setError(err.response?.data?.message || "Failed to load audit logs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, selectedEntity, selectedAction, startDate, endDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedEntity("ALL");
    setSelectedAction("ALL");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleExportCSV = () => {
    if (!logs.length) return;

    const headers = ["ID", "Timestamp", "User Name", "User Email", "Role", "Entity", "Action", "Entity ID", "IP Address"];
    const csvRows = [headers.join(",")];

    logs.forEach((log) => {
      const row = [
        `"${log.id || ""}"`,
        `"${log.created_at ? new Date(log.created_at).toLocaleString() : ""}"`,
        `"${(log.user_name || "").replace(/"/g, '""')}"`,
        `"${(log.user_email || "").replace(/"/g, '""')}"`,
        `"${log.user_role || ""}"`,
        `"${log.entity || ""}"`,
        `"${log.action || ""}"`,
        `"${log.entity_id || ""}"`,
        `"${log.ip_address || ""}"`
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `audit_logs_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyLogDetails = () => {
    if (!selectedLog) return;
    navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper for Badge Styles
  const getActionBadgeStyle = (action) => {
    if (!action) return "bg-gray-100 text-gray-700 border-gray-300";
    const act = action.toUpperCase();

    if (act.includes("CREATE") || act.includes("REGISTER") || act === "CLOCK_IN") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (act.includes("UPDATE") || act.includes("EDIT")) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    if (act.includes("DELETE") || act.includes("REMOVE") || act.includes("REJECT")) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (act.includes("APPROVE") || act === "LOGIN") {
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
    if (act.includes("RESET") || act.includes("STATUS") || act === "CLOCK_OUT") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    return "bg-slate-100 text-slate-700 border-slate-300";
  };

  const getEntityBadgeStyle = (entity) => {
    switch (entity?.toUpperCase()) {
      case "AUTH":
        return "bg-purple-100 text-purple-800 font-medium";
      case "EMPLOYEE":
        return "bg-cyan-100 text-cyan-800 font-medium";
      case "USER":
        return "bg-blue-100 text-blue-800 font-medium";
      case "DEPARTMENT":
        return "bg-indigo-100 text-indigo-800 font-medium";
      case "LEAVE":
        return "bg-amber-100 text-amber-800 font-medium";
      case "ATTENDANCE":
        return "bg-emerald-100 text-emerald-800 font-medium";
      default:
        return "bg-gray-100 text-gray-800 font-medium";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Monitor administrative actions, security events, and user activity trail in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition focus:outline-none"
            title="Refresh logs"
          >
            <span className={`text-base ${loading ? "animate-spin" : ""}`}>🔄</span>
            Refresh
          </button>

          <button
            onClick={handleExportCSV}
            disabled={!logs.length}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition shadow-sm disabled:opacity-50 focus:outline-none"
          >
            <span>📥</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Metrics / Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl text-2xl font-bold">
            📊
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Audit Logs</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-0.5">{stats.totalLogs || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-2xl font-bold">
            ⚡
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions Today</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-0.5">{stats.todayCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl text-2xl font-bold">
            👥
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Users Logged</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-0.5">{stats.uniqueUsersCount || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl text-2xl font-bold">
            🎯
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Main Active Entity</p>
            <p className="text-lg font-bold text-slate-800 mt-0.5 truncate max-w-[140px]">
              {Object.keys(stats.entityBreakdown || {}).sort(
                (a, b) => stats.entityBreakdown[b] - stats.entityBreakdown[a]
              )[0] || "AUTH"}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search user, action, entity..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          {/* Entity Filter */}
          <div>
            <select
              value={selectedEntity}
              onChange={(e) => {
                setSelectedEntity(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            >
              <option value="ALL">All Entities</option>
              <option value="AUTH">AUTH</option>
              <option value="USER">USER</option>
              <option value="EMPLOYEE">EMPLOYEE</option>
              <option value="DEPARTMENT">DEPARTMENT</option>
              <option value="LEAVE">LEAVE</option>
              <option value="ATTENDANCE">ATTENDANCE</option>
            </select>
          </div>

          {/* Action Filter */}
          <div>
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            >
              <option value="ALL">All Actions</option>
              <option value="LOGIN">LOGIN</option>
              <option value="REGISTER">REGISTER</option>
              <option value="CREATE_USER">CREATE_USER</option>
              <option value="UPDATE_USER">UPDATE_USER</option>
              <option value="CHANGE_USER_STATUS">CHANGE_USER_STATUS</option>
              <option value="RESET_PASSWORD">RESET_PASSWORD</option>
              <option value="DELETE_USER">DELETE_USER</option>
              <option value="CREATE_EMPLOYEE">CREATE_EMPLOYEE</option>
              <option value="UPDATE_EMPLOYEE">UPDATE_EMPLOYEE</option>
              <option value="DELETE_EMPLOYEE">DELETE_EMPLOYEE</option>
              <option value="CREATE_DEPARTMENT">CREATE_DEPARTMENT</option>
              <option value="UPDATE_DEPARTMENT">UPDATE_DEPARTMENT</option>
              <option value="DELETE_DEPARTMENT">DELETE_DEPARTMENT</option>
              <option value="CREATE_LEAVE">CREATE_LEAVE</option>
              <option value="APPROVE_LEAVE">APPROVE_LEAVE</option>
              <option value="REJECT_LEAVE">REJECT_LEAVE</option>
              <option value="CLOCK_IN">CLOCK_IN</option>
              <option value="CLOCK_OUT">CLOCK_OUT</option>
            </select>
          </div>

          {/* Reset button */}
          <div className="flex items-center justify-end">
            <button
              onClick={handleResetFilters}
              className="w-full py-2.5 px-4 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition focus:outline-none"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Date Range Inputs */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-sm">
          <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">Date Filter:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError("")} className="text-rose-500 font-bold hover:text-rose-800">
            ✕
          </button>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Timestamp</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Entity</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-6"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-36"></div></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                    <td className="py-4 px-4 text-right"><div className="h-4 bg-slate-200 rounded w-12 ml-auto"></div></td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <span className="text-4xl">🔍</span>
                      <p className="font-semibold text-slate-700">No audit logs found</p>
                      <p className="text-xs text-slate-400">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-slate-600 font-mono text-xs">
                      {log.created_at ? new Date(log.created_at).toLocaleString() : "N/A"}
                    </td>

                    {/* User info */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-semibold text-slate-800">{log.user_name || "System"}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-500">{log.user_email || "-"}</span>
                          {log.user_role && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              {log.user_role}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Entity */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${getEntityBadgeStyle(log.entity)}`}>
                        {log.entity || "SYSTEM"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${getActionBadgeStyle(log.action)}`}>
                        {log.action}
                      </span>
                    </td>

                    {/* IP Address */}
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-500">
                      {log.ip_address || "N/A"}
                    </td>

                    {/* View details button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition"
                      >
                        Inspect 👁️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 bg-white border border-slate-200 rounded-lg focus:outline-none"
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>entries per page (Total {pagination.totalRecords} logs)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1 || loading}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-medium transition disabled:opacity-40"
            >
              Previous
            </button>
            <span className="font-semibold px-2">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages || 1))}
              disabled={page >= (pagination.totalPages || 1) || loading}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-medium transition disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* JSON Payload Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 transform transition-all">
            {/* Modal Header */}
            <div className="p-5 bg-slate-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Audit Log Payload Details</h3>
                <p className="text-xs text-slate-300 font-mono mt-0.5">ID: {selectedLog.id}</p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-300 hover:text-white p-1 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="font-semibold text-slate-500 uppercase block">Action</span>
                  <span className="font-bold text-slate-800">{selectedLog.action}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 uppercase block">Entity</span>
                  <span className="font-bold text-slate-800">{selectedLog.entity}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 uppercase block">User</span>
                  <span className="font-bold text-slate-800">{selectedLog.user_name} ({selectedLog.user_email})</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-500 uppercase block">Client IP</span>
                  <span className="font-bold text-slate-800">{selectedLog.ip_address}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700 uppercase">JSON Payload</span>
                  <button
                    onClick={copyLogDetails}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {copied ? "Copied! ✓" : "Copy JSON 📋"}
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto max-h-60">
                  {JSON.stringify(selectedLog.details || {}, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium text-sm rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuditLog;
