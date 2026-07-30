function DeleteEmployeeModal({
  open,
  employee,
  onClose,
  onConfirm,
}) {
  if (!open || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

        <div className="p-6">

          <h2 className="text-2xl font-bold text-red-600">
            Delete Employee
          </h2>

          <p className="mt-4 text-gray-600">
            Are you sure you want to delete
          </p>

          <p className="font-bold mt-2">
            {employee.name}
          </p>

          <div className="flex justify-end gap-3 mt-8">

            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
            >
              Delete
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DeleteEmployeeModal;