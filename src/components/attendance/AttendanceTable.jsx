import EmptyState from "../ui/EmptyState";

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

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-3 py-3 sm:px-4 sm:py-3 text-left whitespace-nowrap">ID</th>
                            <th className="px-3 py-3 sm:px-4 sm:py-3 text-left whitespace-nowrap">Employee</th>
                            <th className="px-3 py-3 sm:px-4 sm:py-3 text-left whitespace-nowrap">Email</th>
                            <th className="px-3 py-3 sm:px-4 sm:py-3 text-left whitespace-nowrap">Date</th>
                            <th className="px-3 py-3 sm:px-4 sm:py-3 text-left whitespace-nowrap">Check In</th>
                            <th className="px-3 py-3 sm:px-4 sm:py-3 text-left whitespace-nowrap">Check Out</th>
                            <th className="px-3 py-3 sm:px-4 sm:py-3 text-left whitespace-nowrap">Status</th>
                            <th className="px-3 py-3 sm:px-4 sm:py-3 text-center whitespace-nowrap">Action</th>
                        </tr>
                    </thead>

                    <tbody>
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
                                    className="border-t hover:bg-gray-50 text-sm sm:text-base"
                                >
                                    <td className="px-3 py-3 sm:px-4 sm:py-4 font-mono text-sm text-gray-500 whitespace-nowrap">
                                        #{attendance.id}
                                    </td>

                                    <td className="px-3 py-3 sm:px-4 sm:py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {attendance.employees?.name || "-"}
                                    </td>

                                    <td className="px-3 py-3 sm:px-4 sm:py-4 text-gray-600 whitespace-nowrap">
                                        {attendance.employees?.email || "-"}
                                    </td>

                                    <td className="px-3 py-3 sm:px-4 sm:py-4 font-medium whitespace-nowrap">
                                        {attendance.attendance_date}
                                    </td>

                                    <td className="px-3 py-3 sm:px-4 sm:py-4 font-mono font-semibold text-emerald-700 whitespace-nowrap">
                                        {formatTime(attendance.check_in)}
                                    </td>

                                    <td className="px-3 py-3 sm:px-4 sm:py-4 font-mono font-semibold text-rose-700 whitespace-nowrap">
                                        {formatTime(attendance.check_out)}
                                    </td>

                                    <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                                            ${attendance.status?.toLowerCase() === "present"
                                                    ? "bg-green-100 text-green-700"
                                                    : attendance.status?.toLowerCase() === "late"
                                                        ? "bg-amber-100 text-amber-700"
                                                        : attendance.status?.toLowerCase() === "absent"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {attendance.status}
                                        </span>
                                    </td>

                                    <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                                        <div className="flex justify-center gap-2 flex-wrap">
                                            <button
                                                onClick={() => onEdit(attendance)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => onDelete(attendance)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                                            >
                                                Delete
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