import { useEffect, useState } from "react";
import api from "../../api/axios";
import notify from "../../utils/notify";

function LeaveForm({
    mode,
    leave,
    onSuccess,
    onCancel
}) {

    const [employees, setEmployees] = useState([]);

    const [formData, setFormData] = useState({
        employee_id: "",
        leave_type: "annual",
        start_date: "",
        end_date: "",
        reason: "",
        status: "pending"
    });

    const [loading, setLoading] = useState(false);

    const [prevLeave, setPrevLeave] = useState(null);
    const [prevMode, setPrevMode] = useState(mode);

    if (leave !== prevLeave || mode !== prevMode) {
        setPrevLeave(leave);
        setPrevMode(mode);
        if (mode === "edit" && leave) {
            setFormData({
                employee_id: leave.employee_id || "",
                leave_type: leave.leave_type || "annual",
                start_date: leave.start_date || "",
                end_date: leave.end_date || "",
                reason: leave.reason || "",
                status: leave.status || "pending"
            });
        } else if (mode === "add") {
            setFormData({
                employee_id: "",
                leave_type: "annual",
                start_date: "",
                end_date: "",
                reason: "",
                status: "pending"
            });
        }
    }

    useEffect(() => {
        let ignore = false;
        const load = async () => {
            try {
                const response = await api.get("/employees?limit=1000");
                if (!ignore) {
                    setEmployees(response.data.data || []);
                }
            } catch (error) {
                console.error(error);
            }
        };
        load();
        return () => {
            ignore = true;
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.employee_id ||
            !formData.start_date ||
            !formData.end_date
        ) {
            notify.warning("Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                employee_id: Number(formData.employee_id),
                leave_type: formData.leave_type,
                start_date: formData.start_date,
                end_date: formData.end_date,
                reason: formData.reason,
                status: formData.status
            };

            if (mode === "add") {
                await api.post("/leaves", payload);
                notify.success("Leave request created successfully!");
            } else {
                await api.patch(
                    `/leaves/${leave.id}`,
                    payload
                );
                notify.success("Leave request updated successfully!");
            }

            onSuccess();
        } catch (error) {
            console.error(error);
            notify.error(
                error.response?.data?.message ||
                "Failed to save leave request."
            );
        } finally {
            setLoading(false);
        }
    };

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-4"
        >

            <div>

                <label className="block mb-1 font-medium">
                    Employee
                </label>

                <select
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                >

                    <option value="">
                        -- Select Employee --
                    </option>

                    {employees.map((employee) => (

                        <option
                            key={employee.id}
                            value={employee.id}
                        >
                            {employee.name}
                        </option>

                    ))}

                </select>

            </div>

            <div>

                <label className="block mb-1 font-medium">
                    Leave Type
                </label>

                <select
                    name="leave_type"
                    value={formData.leave_type}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                >

                    <option value="annual">
                        Annual Leave
                    </option>

                    <option value="sick">
                        Sick Leave
                    </option>

                    <option value="emergency">
                        Emergency Leave
                    </option>

                    <option value="unpaid">
                        Unpaid Leave
                    </option>

                </select>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                    <label className="block mb-1 font-medium">
                        Start Date
                    </label>

                    <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />

                </div>

                <div>

                    <label className="block mb-1 font-medium">
                        End Date
                    </label>

                    <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                    />

                </div>

            </div>

            <div>

                <label className="block mb-1 font-medium">
                    Status
                </label>

                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                >

                    <option value="pending">
                        Pending
                    </option>

                    <option value="approved">
                        Approved
                    </option>

                    <option value="rejected">
                        Rejected
                    </option>

                </select>

            </div>

            <div>

                <label className="block mb-1 font-medium">
                    Reason
                </label>

                <textarea
                    rows="4"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                />

            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">

                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full sm:w-auto px-5 py-2 border rounded-lg hover:bg-gray-50 font-medium"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg disabled:opacity-50 font-medium"
                >
                    {loading
                        ? "Saving..."
                        : mode === "add"
                        ? "Save Leave"
                        : "Update Leave"}
                </button>

            </div>

        </form>

    );

}

export default LeaveForm;