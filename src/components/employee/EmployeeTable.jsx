import EmptyState from "../ui/EmptyState";

function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="px-5 py-3 text-left">ID</th>
            <th className="px-5 py-3 text-left">Name</th>
            <th className="px-5 py-3 text-left">Email</th>
            <th className="px-5 py-3 text-left">Phone</th>
            <th className="px-5 py-3 text-left">Department</th>
            <th className="px-5 py-3 text-left">Position</th>
            <th className="px-5 py-3 text-left">Salary</th>
            <th className="px-5 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan={6}>
                <EmptyState
                  title="No Employees Found"
                  description="Add your first employee to get started."
                />
              </td>
            </tr>
          ) : (
            employees.map((employee) => (
              <tr
                key={employee.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-5 py-4">{employee.id}</td>

                <td className="px-5 py-4">{employee.name}</td>

                <td className="px-5 py-4">{employee.email}</td>

                <td className="px-5 py-4">{employee.phone}</td>

                <td className="px-5 py-4">
                  {employee.departments?.name}
                </td>

                <td className="px-5 py-4">
                  {employee.position}
                </td>

                <td className="px-5 py-4">
                  RM {employee.salary}
                </td>

                <td className="px-5 py-4 text-center space-x-2">
                  <button
                    onClick={() => onEdit(employee)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(employee)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;