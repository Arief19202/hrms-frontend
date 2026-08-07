import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";

function DeleteAttendanceModal({
  open,
  attendance,
  onClose,
  onConfirm
}) {
  if (!open) return null;

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
            Delete Attendance
          </h2>

          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Are you sure you want to delete this attendance record? This action cannot be undone.
          </p>

          {attendance && (
            <div className="mt-4 bg-slate-50/80 border border-slate-100 rounded-xl p-4 text-sm space-y-1.5 text-slate-700">
              <p>
                <strong className="text-slate-900 font-semibold">Employee:</strong>{" "}
                {attendance.employees?.name || "-"}
              </p>
              <p>
                <strong className="text-slate-900 font-semibold">Date:</strong>{" "}
                {attendance.attendance_date}
              </p>
              <p>
                <strong className="text-slate-900 font-semibold">Status:</strong>{" "}
                <span className="capitalize px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  {attendance.status}
                </span>
              </p>
            </div>
          )}

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
              Delete Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteAttendanceModal;