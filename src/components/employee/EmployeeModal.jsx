function EmployeeModal({
  open,
  title,
  children,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 sm:px-6 py-4">
          <h2 className="text-xl sm:text-2xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  );
}

export default EmployeeModal;