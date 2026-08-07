import EmptyState from "../ui/EmptyState";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}) {
  const getInitials = (name) => {
    if (!name) return "E";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/90 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200/80">
            <tr>
              <th className="px-5 py-4 whitespace-nowrap">Employee</th>
              <th className="px-5 py-4 whitespace-nowrap">Email</th>
              <th className="px-5 py-4 whitespace-nowrap">Phone</th>
              <th className="px-5 py-4 whitespace-nowrap">Department</th>
              <th className="px-5 py-4 whitespace-nowrap">Position</th>
              <th className="px-5 py-4 whitespace-nowrap">Status</th>
              <th className="px-5 py-4 whitespace-nowrap">Salary</th>
              <th className="px-5 py-4 text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
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
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {getInitials(employee.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{employee.name}</div>
                        <div className="text-xs text-slate-400">ID: #{employee.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-600 font-medium">
                    {employee.email}
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-600">
                    {employee.phone || "-"}
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                      {employee.departments?.name || "-"}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap text-slate-700 font-medium">
                    {employee.position}
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize border ${
                        employee.status?.toLowerCase() === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          employee.status?.toLowerCase() === "active"
                            ? "bg-emerald-500"
                            : "bg-rose-500"
                        }`}
                      />
                      {employee.status || "active"}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 whitespace-nowrap font-medium text-slate-900">
                    RM {Number(employee.salary || 0).toLocaleString()}
                  </td>

                  <td className="px-5 py-3.5 text-center whitespace-nowrap">
                    <div className="inline-flex gap-1.5 justify-center">
                      <button
                        onClick={() => onEdit(employee)}
                        className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition"
                        title="Edit Employee"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDelete(employee)}
                        className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Delete Employee"
                      >
                        <TrashIcon className="w-4 h-4" />
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