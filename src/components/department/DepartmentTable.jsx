import EmptyState from "../ui/EmptyState";

function DepartmentTable({
  departments = [],
  onEdit,
  onDelete,
}) {
  // Guarantee sorting by ID in ascending order (1, 2, 3, 4, 5...)
  const sortedDepartments = [...departments].sort(
    (a, b) => (Number(a.id) || 0) - (Number(b.id) || 0)
  );

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap font-bold">
                ID
              </th>

              <th className="text-left px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap font-bold">
                Department Name
              </th>

              <th className="text-left px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap font-bold">
                Description
              </th>

              <th className="text-center px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap font-bold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedDepartments.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <EmptyState
                    title="No Departments Found"
                    description="Create your first department to get started."
                  />
                </td>
              </tr>
            ) : (
              sortedDepartments.map((department) => (
                <tr
                  key={department.id}
                  className="border-t hover:bg-gray-50 text-sm sm:text-base transition-colors"
                >
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap font-mono text-gray-700">
                    {department.id}
                  </td>

                  <td className="px-3 py-3 sm:px-6 sm:py-4 font-semibold whitespace-nowrap text-gray-900">
                    {department.name}
                  </td>

                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-gray-600">
                    {department.description || "-"}
                  </td>

                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(department)}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(department)}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition"
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

export default DepartmentTable;