function AttendanceModal({
    open,
    title,
    children,
    onClose
}) {

    if (!open) {
        return null;
    }

    return (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">

                <div className="flex items-center justify-between border-b px-4 sm:px-6 py-4">

                    <h2 className="text-xl sm:text-2xl font-bold">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500 text-2xl"
                    >
                        ×
                    </button>

                </div>

                <div className="p-4 sm:p-6 overflow-y-auto">

                    {children}

                </div>

            </div>

        </div>

    );
}

export default AttendanceModal;