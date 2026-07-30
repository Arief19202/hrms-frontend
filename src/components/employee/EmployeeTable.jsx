import EmptyState from "../ui/EmptyState";

function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="px-3 py-3 sm:px-5 sm:py-3 text-left whitespace-nowrap">ID</th>
              <th className="px-3 py-3 sm:px-5 sm:py-3 text-left whitespace-nowrap">Name</th>
              <th className="px-3 py-3 sm:px-5 sm:py-3 text-left whitespace-nowrap">Email</th>
              <th className="px-3 py-3 sm:px-5 sm:py-3 text-left whitespace-nowrap">Phone</th>
              <th className="px-3 py-3 sm:px-5 sm:py-3 text-left whitespace-nowrap">Department</th>
              <th className="px-3 py-3 sm:px-5 sm:py-3 text-left whitespace-nowrap">Position</th>
              <th className="px-3 py-3 sm:px-5 sm:py-3 text-left whitespace-nowrap">Salary</th>
              <th className="px-3 py-3 sm:px-5 sm:py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={8}>
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
                  className="border-b hover:bg-gray-50 text-sm sm:text-base"
                >
                  <td className="px-3 py-3 sm:px-5 sm:py-4 whitespace-nowrap">{employee.id}</td>

                  <td className="px-3 py-3 sm:px-5 sm:py-4 whitespace-nowrap">{employee.name}</td>

                  <td className="px-3 py-3 sm:px-5 sm:py-4 whitespace-nowrap">{employee.email}</td>

                  <td className="px-3 py-3 sm:px-5 sm:py-4 whitespace-nowrap">{employee.phone}</td>

                  <td className="px-3 py-3 sm:px-5 sm:py-4 whitespace-nowrap">
                    {employee.departments?.name}
                  </td>

                  <td className="px-3 py-3 sm:px-5 sm:py-4 whitespace-nowrap">
                    {employee.position}
                  </td>

                  <td className="px-3 py-3 sm:px-5 sm:py-4 whitespace-nowrap">
                    RM {employee.salary}
                  </td>

                  <td className="px-3 py-3 sm:px-5 sm:py-4 text-center whitespace-nowrap">
                    <div className="inline-flex gap-2 flex-wrap justify-center">
                      <button
                        onClick={() => onEdit(employee)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => onDelete(employee)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm"
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

export default EmployeeTable;