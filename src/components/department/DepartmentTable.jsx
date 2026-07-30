import EmptyState from "../ui/EmptyState";

function DepartmentTable({
  departments,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr>

            <th className="text-left px-6 py-4">
              ID
            </th>

            <th className="text-left px-6 py-4">
              Department Name
            </th>

            <th className="text-left px-6 py-4">
              Description
            </th>

            <th className="text-center px-6 py-4">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {departments.length === 0 ? (
            <tr>
              <td colSpan={6}>
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
                className="border-t hover:bg-gray-50"
              >

                <td className="px-6 py-4">
                  {department.id}
                </td>

                <td className="px-6 py-4 font-medium">
                  {department.name}
                </td>

                <td className="px-6 py-4">
                  {department.description || "-"}
                </td>

                <td className="px-6 py-4">

                  <div className="flex justify-center gap-3">

                    <button
                      onClick={() => onEdit(department)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(department)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
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
  );
}

export default DepartmentTable;