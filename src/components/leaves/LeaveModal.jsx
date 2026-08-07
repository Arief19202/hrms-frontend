import LeaveForm from "./LeaveForm";

function LeaveModal({
    open,
    mode,
    leave,
    onClose,
    onSuccess
}) {

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-xl font-bold">

                        {mode === "add"
                            ? "Add Leave Request"
                            : "Edit Leave Request"}

                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-2xl"
                    >
                        ×
                    </button>

                </div>

                <LeaveForm
                    mode={mode}
                    leave={leave}
                    onSuccess={onSuccess}
                    onCancel={onClose}
                />

            </div>

        </div>

    );

}

export default LeaveModal;