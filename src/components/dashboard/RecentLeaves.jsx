import EmptyState from "../ui/EmptyState";

function RecentLeaves({ leaves }) {

    return (

        <div className="bg-white rounded-xl shadow mt-8 overflow-hidden">

            <div className="px-6 py-4 border-b">

                <h2 className="text-xl font-semibold">
                    Recent Leave Requests
                </h2>

            </div>

            <div className="overflow-x-auto">
              <table className="w-full">

                <thead className="bg-gray-100">

                    <tr>

                        <th className="text-left px-4 py-3 whitespace-nowrap">
                            Employee
                        </th>

                        <th className="text-left px-4 py-3 whitespace-nowrap">
                            Leave Type
                        </th>

                        <th className="text-left px-4 py-3 whitespace-nowrap">
                            Status
                        </th>

                    </tr>

                </thead>

                <tbody>

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
                                className="border-t"
                            >

                                <td className="px-4 py-3 whitespace-nowrap">
                                    {leave.employees?.name}
                                </td>

                                <td className="px-4 py-3 capitalize whitespace-nowrap">
                                    {leave.leave_type}
                                </td>

                                <td className="px-4 py-3 whitespace-nowrap">

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs sm:text-sm
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

        </div>

    );

}

export default RecentLeaves;