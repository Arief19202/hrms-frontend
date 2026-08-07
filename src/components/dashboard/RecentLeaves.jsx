import EmptyState from "../ui/EmptyState";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

function RecentLeaves({ leaves }) {
  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "approved") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
    }
    if (s === "rejected") {
      return "bg-rose-50 text-rose-700 border-rose-200/80";
    }
    return "bg-amber-50 text-amber-700 border-amber-200/80";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm mt-8 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
          <DocumentTextIcon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Recent Leave Requests
          </h2>
          <p className="text-xs text-slate-500">
            Latest employee leave applications
          </p>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/80 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-3.5 whitespace-nowrap">Employee</th>
              <th className="px-6 py-3.5 whitespace-nowrap">Leave Type</th>
              <th className="px-6 py-3.5 whitespace-nowrap">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {leaves.length === 0 ? (
              <tr>
                <td colSpan={3}>
                  <EmptyState
                    title="No Leave Requests"
                    description="There are no leave requests to display."
                  />
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr
                  key={leave.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                    {leave.employees?.name}
                  </td>

                  <td className="px-6 py-4 capitalize text-slate-600 whitespace-nowrap">
                    {leave.leave_type}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${getStatusBadge(
                        leave.status
                      )}`}
                    >
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentLeaves;