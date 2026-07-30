function DeleteEmployeeModal({
  open,
  employee,
  onClose,
  onConfirm,
}) {
  if (!open || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">

        <div className="p-6">

          <h2 className="text-xl sm:text-2xl font-bold text-red-600">
            Delete Employee
          </h2>

          <p className="mt-4 text-gray-600 text-sm sm:text-base">
            Are you sure you want to delete
          </p>

          <p className="font-bold mt-2 text-gray-800">
            {employee.name}
          </p>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">

            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg font-medium"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium"
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