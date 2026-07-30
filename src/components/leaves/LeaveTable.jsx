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
            <div className="bg-white rounded-lg shadow p-6 text-center">
                Loading...
            </div>
        );
    }

    if (!leaves.length) {
        return (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                No leave requests found.
            </div>
        );
    }

    const getStatusClass = (status) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-700";

            case "rejected":
                return "bg-red-100 text-red-700";

            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    return (
        <div className="bg-white rounded-xl shadow overflow-x-auto">

            <table className="min-w-full">

                <thead className="bg-gray-100">

                    <tr>
                        <th className="px-4 py-3 text-left">
                            Employee
                        </th>

                        <th className="px-4 py-3 text-left">
                            Leave Type
                        </th>

                        <th className="px-4 py-3 text-left">
                            Start Date
                        </th>

                        <th className="px-4 py-3 text-left">
                            End Date
                        </th>

                        <th className="px-4 py-3 text-left">
                            Status
                        </th>

                        <th className="px-4 py-3 text-center">
                            Actions
                        </th>
                    </tr>

                </thead>

                <tbody>

                    {leaves.map((leave) => (

                        <tr
                            key={leave.id}
                            className="border-t hover:bg-gray-50"
                        >

                            <td className="px-4 py-3">
                                {leave.employees?.name}
                            </td>

                            <td className="px-4 py-3 capitalize">
                                {leave.leave_type}
                            </td>

                            <td className="px-4 py-3">
                                {leave.start_date}
                            </td>

                            <td className="px-4 py-3">
                                {leave.end_date}
                            </td>

                            <td className="px-4 py-3">

                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                                        leave.status
                                    )}`}
                                >
                                    {leave.status}
                                </span>

                            </td>

                            <td className="px-4 py-3">

                                <div className="flex justify-center gap-2 flex-wrap">

                                    <button
                                        onClick={() => onEdit(leave)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => onDelete(leave)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>

                                    {leave.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => onApprove(leave.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={() => onReject(leave.id)}
                                                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );

}

export default LeaveTable;