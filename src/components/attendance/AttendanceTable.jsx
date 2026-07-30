import EmptyState from "../ui/EmptyState";

function AttendanceTable({
    attendances,
    onEdit,
    onDelete
}) {

    if (!attendances.length) {
        return (
            <tr>
                <td colSpan={6}>
                    <EmptyState
                        title="No Attendance Found"
                        description="No attendance records available."
                    />
                </td>
            </tr>
        );
    }

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

    return (
        <div className="bg-white rounded-lg shadow overflow-x-auto">

            <table className="min-w-full">

                <thead className="bg-gray-100">

                    <tr>

                        <th className="px-4 py-3 text-left">
                            ID
                        </th>

                        <th className="px-4 py-3 text-left">
                            Employee
                        </th>

                        <th className="px-4 py-3 text-left">
                            Email
                        </th>

                        <th className="px-4 py-3 text-left">
                            Date
                        </th>

                        <th className="px-4 py-3 text-left">
                            Check In
                        </th>

                        <th className="px-4 py-3 text-left">
                            Check Out
                        </th>

                        <th className="px-4 py-3 text-left">
                            Status
                        </th>

                        <th className="px-4 py-3 text-center">
                            Action
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {attendances.map((attendance) => (

                        <tr
                            key={attendance.id}
                            className="border-t hover:bg-gray-50"
                        >

                            <td className="px-4 py-3 font-mono text-sm text-gray-500">
                                #{attendance.id}
                            </td>

                            <td className="px-4 py-3 font-medium text-gray-900">
                                {attendance.employees?.name || "-"}
                            </td>

                            <td className="px-4 py-3 text-gray-600">
                                {attendance.employees?.email || "-"}
                            </td>

                            <td className="px-4 py-3 font-medium">
                                {attendance.attendance_date}
                            </td>

                            <td className="px-4 py-3 font-mono font-semibold text-emerald-700">
                                {formatTime(attendance.check_in)}
                            </td>

                            <td className="px-4 py-3 font-mono font-semibold text-rose-700">
                                {formatTime(attendance.check_out)}
                            </td>

                            <td className="px-4 py-3">

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

                            <td className="px-4 py-3">

                                <div className="flex justify-center gap-2">

                                    <button
                                        onClick={() => onEdit(attendance)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => onDelete(attendance)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default AttendanceTable;