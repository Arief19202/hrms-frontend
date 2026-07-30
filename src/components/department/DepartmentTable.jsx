import EmptyState from "../ui/EmptyState";

function DepartmentTable({
  departments,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                ID
              </th>

              <th className="text-left px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                Department Name
              </th>

              <th className="text-left px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                Description
              </th>

              <th className="text-center px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan={4}>
                  <EmptyState
                    title="No Departments Found"
                    description="Create your first department to get started."
                  />
                </td>
              </tr>
            ) : (
              departments.map((department) => (
                <tr
                  key={department.id}
                  className="border-t hover:bg-gray-50 text-sm sm:text-base"
                >
                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                    {department.id}
                  </td>

                  <td className="px-3 py-3 sm:px-6 sm:py-4 font-medium whitespace-nowrap">
                    {department.name}
                  </td>

                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                    {department.description || "-"}
                  </td>

                  <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                    <div className="flex justify-center gap-2 flex-wrap">
                      <button
                        onClick={() => onEdit(department)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => onDelete(department)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm"
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