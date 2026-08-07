import { useEffect, useState } from "react";
import api from "../../api/axios";
import notify from "../../utils/notify";

function AttendanceForm({
    mode,
    attendance,
    onSuccess,
    onCancel
}) {

    const [employees, setEmployees] = useState([]);

    const [formData, setFormData] = useState({
        employee_id: "",
        attendance_date: "",
        check_in: "",
        check_out: "",
        status: "present",
        notes: ""
    });

    const [loading, setLoading] = useState(false);

    const [prevAttendance, setPrevAttendance] = useState(null);
    const [prevMode, setPrevMode] = useState(mode);

    if (attendance !== prevAttendance || mode !== prevMode) {
        setPrevAttendance(attendance);
        setPrevMode(mode);
        if (mode === "edit" && attendance) {
            setFormData({
                employee_id: attendance.employee_id || "",
                attendance_date: attendance.attendance_date || "",
                check_in: attendance.check_in
                    ? attendance.check_in.substring(11, 16)
                    : "",
                check_out: attendance.check_out
                    ? attendance.check_out.substring(11, 16)
                    : "",
                status: attendance.status || "present",
                notes: attendance.notes || ""
            });
        } else if (mode === "add") {
            setFormData({
                employee_id: "",
                attendance_date: "",
                check_in: "",
                check_out: "",
                status: "present",
                notes: ""
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
            !formData.attendance_date
        ) {
            notify.warning("Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                employee_id: Number(formData.employee_id),
                attendance_date: formData.attendance_date,
                check_in: formData.check_in
                    ? `${formData.attendance_date}T${formData.check_in}:00`
                    : null,
                check_out: formData.check_out
                    ? `${formData.attendance_date}T${formData.check_out}:00`
                    : null,
                status: formData.status,
                notes: formData.notes
            };

            if (mode === "add") {
                await api.post("/attendances", payload);
                notify.success("Attendance logged successfully!");
            } else {
                await api.patch(
                    `/attendances/${attendance.id}`,
                    payload
                );
                notify.success("Attendance updated successfully!");
            }

            onSuccess();
        } catch (error) {
            console.error(error);
            notify.error(
                error.response?.data?.message ||
                "Failed to save attendance."
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
                    Attendance Date
                </label>

                <input
                    type="date"
                    name="attendance_date"
                    value={formData.attendance_date}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                />

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                    <label className="block mb-1 font-medium">
                        Clock In Time
                    </label>

                    <input
                        type="time"
                        name="check_in"
                        value={formData.check_in}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                    />

                </div>

                <div>

                    <label className="block mb-1 font-medium">
                        Clock Out Time
                    </label>

                    <input
                        type="time"
                        name="check_out"
                        value={formData.check_out}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
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

                    <option value="present">
                        Present
                    </option>

                    <option value="late">
                        Late
                    </option>

                    <option value="absent">
                        Absent
                    </option>

                    <option value="on_leave">
                        On Leave
                    </option>

                </select>

            </div>

            <div>

                <label className="block mb-1 font-medium">
                    Notes
                </label>

                <textarea
                    rows="4"
                    name="notes"
                    value={formData.notes}
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
                        ? "Save Attendance"
                        : "Update Attendance"}
                </button>

            </div>

        </form>

    );
}

export default AttendanceForm;