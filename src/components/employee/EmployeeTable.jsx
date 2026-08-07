import EmptyState from "../ui/EmptyState";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-4 py-3.5 whitespace-nowrap">ID</th>
              <th className="px-4 py-3.5 whitespace-nowrap">Name</th>
              <th className="px-4 py-3.5 whitespace-nowrap">Email</th>
              <th className="px-4 py-3.5 whitespace-nowrap">Phone</th>
              <th className="px-4 py-3.5 whitespace-nowrap">Department</th>
              <th className="px-4 py-3.5 whitespace-nowrap">Position</th>
              <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
              <th className="px-4 py-3.5 whitespace-nowrap">Salary</th>
              <th className="px-4 py-3.5 text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <EmptyState
                    title="No Employees Found"
                    description="Add your first employee to get started."
                  />
                </td>
              </tr>
            ) : (
              employees.map((employee) => {
                const isActive = (employee.status || "active").toLowerCase() === "active";
                return (
                  <tr
                    key={employee.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-medium text-slate-400 text-xs whitespace-nowrap">#{employee.id}</td>

                    <td className="px-4 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
                      {employee.name}
                    </td>

                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">{employee.email}</td>

                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{employee.phone || "-"}</td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                        {employee.departments?.name || "-"}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                      {employee.position}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                            : "bg-rose-50 text-rose-700 border-rose-200/80"
                        }`}
                      >
                        {employee.status || "active"}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
                      RM {employee.salary}
                    </td>

                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <div className="inline-flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onEdit(employee)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit employee"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDelete(employee)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete employee"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeTable;