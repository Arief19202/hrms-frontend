function DeleteLeaveModal({
    open,
    leave,
    onClose,
    onDelete
}) {

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-4 sm:p-6">

                <h2 className="text-xl font-bold mb-4 text-red-600">
                    Delete Leave Request
                </h2>

                <p className="text-gray-600 mb-6 text-sm sm:text-base">

                    Are you sure you want to delete this leave request?

                </p>

                <div className="bg-gray-100 rounded-lg p-4 mb-6 text-sm sm:text-base">

                    <p>
                        <strong>Employee:</strong>{" "}
                        {leave?.employees?.name || "-"}
                    </p>

                    <p>
                        <strong>Leave Type:</strong>{" "}
                        {leave?.leave_type}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}
                        {leave?.status}
                    </p>

                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-5 py-2 border rounded-lg hover:bg-gray-50 font-medium"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onDelete}
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteLeaveModal;