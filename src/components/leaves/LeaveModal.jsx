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

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">

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