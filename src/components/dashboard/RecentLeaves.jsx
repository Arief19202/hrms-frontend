import EmptyState from "../ui/EmptyState";

function RecentLeaves({ leaves }) {

    return (

        <div className="bg-white rounded-xl shadow mt-8 overflow-hidden">

            <div className="px-6 py-4 border-b">

                <h2 className="text-xl font-semibold">
                    Recent Leave Requests
                </h2>

            </div>

            <table className="w-full">

                <thead className="bg-gray-100">

                    <tr>

                        <th className="text-left px-4 py-3">
                            Employee
                        </th>

                        <th className="text-left px-4 py-3">
                            Leave Type
                        </th>

                        <th className="text-left px-4 py-3">
                            Status
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {leaves.length === 0 ? (

                        <tr>
                            <td colSpan={6}>
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
                                className="border-t"
                            >

                                <td className="px-4 py-3">
                                    {leave.employees?.name}
                                </td>

                                <td className="px-4 py-3 capitalize">
                                    {leave.leave_type}
                                </td>

                                <td className="px-4 py-3">

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm
                                        ${
                                            leave.status === "approved"
                                                ? "bg-green-100 text-green-700"
                                                : leave.status === "rejected"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
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

    );

}

export default RecentLeaves;