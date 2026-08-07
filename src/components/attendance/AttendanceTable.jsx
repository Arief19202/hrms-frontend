import EmptyState from "../ui/EmptyState";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

function AttendanceTable({
    attendances = [],
    onEdit,
    onDelete
}) {
    const formatTime = (timeStr) => {
        if (!timeStr) return "-";
        try {
            if (timeStr.includes("T") || timeStr.includes("-")) {
                const d = new Date(timeStr);
                if (!isNaN(d.getTime())) {
                    return d.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                    });
                }
            }
            const parts = timeStr.split(":");
            if (parts.length >= 2) {
                const date = new Date();
                date.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0);
                return date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                });
            }
            return timeStr;
        } catch {
            return timeStr;
        }
    };

    const list = attendances || [];

    const getStatusStyle = (status) => {
        const s = (status || "").toLowerCase();
        if (s === "present") return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
        if (s === "late") return "bg-amber-50 text-amber-700 border-amber-200/80";
        if (s === "absent") return "bg-rose-50 text-rose-700 border-rose-200/80";
        return "bg-slate-100 text-slate-700 border-slate-200/80";
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/80 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="px-4 py-3.5 whitespace-nowrap">ID</th>
                            <th className="px-4 py-3.5 whitespace-nowrap">Employee</th>
                            <th className="px-4 py-3.5 whitespace-nowrap">Email</th>
                            <th className="px-4 py-3.5 whitespace-nowrap">Date</th>
                            <th className="px-4 py-3.5 whitespace-nowrap">Clock In</th>
                            <th className="px-4 py-3.5 whitespace-nowrap">Clock Out</th>
                            <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
                            <th className="px-4 py-3.5 text-center whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {!list.length ? (
                            <tr>
                                <td colSpan={8}>
                                    <EmptyState
                                        title="No Attendance Found"
                                        description="No attendance records available."
                                    />
                                </td>
                            </tr>
                        ) : (
                            list.map((attendance) => (
                                <tr
                                    key={attendance.id}
                                    className="hover:bg-slate-50/60 transition-colors"
                                >
                                    <td className="px-4 py-3.5 font-medium text-slate-400 text-xs whitespace-nowrap">
                                        #{attendance.id}
                                    </td>

                                    <td className="px-4 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
                                        {attendance.employees?.name || "-"}
                                    </td>

                                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                                        {attendance.employees?.email || "-"}
                                    </td>

                                    <td className="px-4 py-3.5 font-medium text-slate-700 whitespace-nowrap">
                                        {attendance.attendance_date}
                                    </td>

                                    <td className="px-4 py-3.5 font-mono font-semibold text-emerald-600 whitespace-nowrap">
                                        {formatTime(attendance.check_in)}
                                    </td>

                                    <td className="px-4 py-3.5 font-mono font-semibold text-rose-600 whitespace-nowrap">
                                        {formatTime(attendance.check_out)}
                                    </td>

                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${getStatusStyle(attendance.status)}`}
                                        >
                                            {attendance.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                        <div className="inline-flex items-center justify-center gap-1.5">
                                            <button
                                                onClick={() => onEdit(attendance)}
                                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit record"
                                            >
                                                <PencilSquareIcon className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => onDelete(attendance)}
                                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Delete record"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
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

export default AttendanceTable;