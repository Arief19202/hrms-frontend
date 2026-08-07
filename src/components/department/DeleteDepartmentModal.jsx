import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";

function DeleteDepartmentModal({
  open,
  department,
  onClose,
  onConfirm,
}) {
  if (!open || !department) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in-scale">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md mx-auto overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7">
          {/* Warning Icon Badge */}
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-sm">
            <ExclamationTriangleIcon className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Delete Department
          </h2>

          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Are you sure you want to delete this department? This action cannot be undone.
          </p>

          {/* Department Name Card */}
          <div className="mt-4 bg-slate-50/80 border border-slate-100 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
              {department.name ? department.name.charAt(0).toUpperCase() : "D"}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">{department.name}</p>
              <p className="text-xs text-slate-500">{department.description || "Department Record"}</p>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all active:scale-95"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-xl font-semibold text-sm shadow-md shadow-rose-500/25 transition-all active:scale-95"
            >
              Delete Department
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteDepartmentModal;