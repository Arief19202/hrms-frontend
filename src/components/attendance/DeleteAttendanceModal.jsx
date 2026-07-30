function DeleteAttendanceModal({
    open,
    attendance,
    onClose,
    onConfirm
}) {

    if (!open) {
        return null;
    }

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">

                <div className="px-6 py-4 border-b">

                    <h2 className="text-xl font-bold text-red-600">
                        Delete Attendance
                    </h2>

                </div>

                <div className="p-6">

                    <p className="text-gray-700 text-sm sm:text-base">

                        Are you sure you want to delete this attendance record?

                    </p>

                    {attendance && (

                        <div className="mt-4 bg-gray-50 rounded-lg p-4 text-sm sm:text-base">

                            <p>

                                <strong>Employee :</strong>{" "}
                                {attendance.employees?.name}

                            </p>

                            <p>

                                <strong>Date :</strong>{" "}
                                {attendance.attendance_date}

                            </p>

                            <p>

                                <strong>Status :</strong>{" "}
                                {attendance.status}

                            </p>

                        </div>

                    )}

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">

                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto px-5 py-2 border rounded-lg hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onConfirm}
                            className="w-full sm:w-auto px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default DeleteAttendanceModal;