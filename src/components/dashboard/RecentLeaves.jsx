import EmptyState from "../ui/EmptyState";
import { DocumentCheckIcon, UserIcon } from "@heroicons/react/24/outline";

function RecentLeaves({ leaves }) {
    const getInitials = (name) => {
        if (!name) return "E";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-card mt-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <DocumentCheckIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900 font-heading">
                            Recent Leave Requests
                        </h3>
                        <p className="text-xs text-slate-500">
                            Latest applications needing attention
                        </p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/80 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3.5 whitespace-nowrap">Employee</th>
                            <th className="px-6 py-3.5 whitespace-nowrap">Leave Type</th>
                            <th className="px-6 py-3.5 whitespace-nowrap">Status</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm">
                        {leaves.length === 0 ? (
                            <tr>
                                <td colSpan={3}>
                                    <EmptyState
                                        title="No Recent Leave Requests"
                                        description="There are no leave requests pending or submitted recently."
                                    />
                                </td>
                            </tr>
                        ) : (
                            leaves.map((leave) => (
                                <tr
                                    key={leave.id}
                                    className="hover:bg-slate-50/60 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                                                {getInitials(leave.employees?.name)}
                                            </div>
                                            <span className="font-medium text-slate-800">
                                                {leave.employees?.name || "Employee"}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 capitalize whitespace-nowrap text-slate-600 font-medium">
                                        {leave.leave_type}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize border ${
                                                leave.status === "approved"
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                    : leave.status === "rejected"
                                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                            }`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${
                                                    leave.status === "approved"
                                                        ? "bg-emerald-500"
                                                        : leave.status === "rejected"
                                                        ? "bg-rose-500"
                                                        : "bg-amber-500 animate-pulse"
                                                }`}
                                            />
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