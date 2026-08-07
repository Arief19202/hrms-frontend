import { PencilSquareIcon, TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

function LeaveTable({
    leaves,
    loading,
    onEdit,
    onDelete,
    onApprove,
    onReject
}) {

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center flex flex-col justify-center items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                <p className="text-sm font-medium text-slate-500">Loading leave requests...</p>
            </div>
        );
    }

    if (!leaves || !leaves.length) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-500 text-sm">
                No leave requests found.
            </div>
        );
    }

    const getStatusStyle = (status) => {
        const s = (status || "").toLowerCase();
        if (s === "approved") return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
        if (s === "rejected") return "bg-rose-50 text-rose-700 border-rose-200/80";
        return "bg-amber-50 text-amber-700 border-amber-200/80";
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50/80 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="px-4 py-3.5 whitespace-nowrap">Employee</th>
                            <th className="px-4 py-3.5 whitespace-nowrap">Leave Type</th>
                            <th className="px-4 py-3.5 whitespace-nowrap">Start Date</th>
                            <th className="px-4 py-3.5 whitespace-nowrap">End Date</th>
                            <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
                            <th className="px-4 py-3.5 text-center whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {leaves.map((leave) => (
                            <tr
                                key={leave.id}
                                className="hover:bg-slate-50/60 transition-colors"
                            >
                                <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-slate-900">
                                    {leave.employees?.name}
                                </td>

                                <td className="px-4 py-3.5 capitalize text-slate-600 whitespace-nowrap">
                                    {leave.leave_type}
                                </td>

                                <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                                    {leave.start_date}
                                </td>

                                <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                                    {leave.end_date}
                                </td>

                                <td className="px-4 py-3.5 whitespace-nowrap">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${getStatusStyle(
                                            leave.status
                                        )}`}
                                    >
                                        {leave.status}
                                    </span>
                                </td>

                                <td className="px-4 py-3.5 whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                        <button
                                            onClick={() => onEdit(leave)}
                                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit request"
                                        >
                                            <PencilSquareIcon className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => onDelete(leave)}
                                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                            title="Delete request"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>

                                        {leave.status !== "approved" && (
                                            <button
                                                onClick={() => onApprove(leave.id)}
                                                className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm transition"
                                                title="Approve leave"
                                            >
                                                <CheckIcon className="w-3.5 h-3.5" />
                                                <span>Approve</span>
                                            </button>
                                        )}

                                        {leave.status !== "rejected" && (
                                            <button
                                                onClick={() => onReject(leave.id)}
                                                className="flex items-center gap-1 bg-rose-500 hover:bg-rose-600 text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm transition"
                                                title="Reject leave"
                                            >
                                                <XMarkIcon className="w-3.5 h-3.5" />
                                                <span>Reject</span>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LeaveTable;