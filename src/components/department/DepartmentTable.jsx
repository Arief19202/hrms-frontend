import EmptyState from "../ui/EmptyState";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

function DepartmentTable({
  departments,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-3.5 whitespace-nowrap">ID</th>
              <th className="px-6 py-3.5 whitespace-nowrap">Department Name</th>
              <th className="px-6 py-3.5 whitespace-nowrap">Description</th>
              <th className="px-6 py-3.5 text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
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
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-400 text-xs whitespace-nowrap">
                    #{department.id}
                  </td>

                  <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                    {department.name}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {department.description || "-"}
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="inline-flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onEdit(department)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit department"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDelete(department)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete department"
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

export default DepartmentTable;