function DepartmentModal({
  open,
  title,
  children,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">

        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">

          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-2xl"
          >
            ×
          </button>

        </div>

        {/* Body */}
        <div className="p-6">
          {children}
        </div>

      </div>

    </div>
  );
}

export default DepartmentModal;