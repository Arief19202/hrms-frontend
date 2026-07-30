function DeleteLeaveModal({
    open,
    leave,
    onClose,
    onDelete
}) {

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

                <h2 className="text-xl font-bold mb-4">
                    Delete Leave Request
                </h2>

                <p className="text-gray-600 mb-6">

                    Are you sure you want to delete this leave request?

                </p>

                <div className="bg-gray-100 rounded-lg p-4 mb-6">

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

                <div className="flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="px-5 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onDelete}
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteLeaveModal;