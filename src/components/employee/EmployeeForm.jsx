import { useEffect, useState } from "react";
import api from "../../api/axios";
import notify from "../../utils/notify";

function EmployeeForm({
  mode = "add",
  employee = null,
  onSuccess,
  onCancel,
}) {
  const [departments, setDepartments] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department_id: "",
    position: "",
    salary: "",
    hire_date: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const [prevEmployee, setPrevEmployee] = useState(null);
  const [prevMode, setPrevMode] = useState(mode);

  if (employee !== prevEmployee || mode !== prevMode) {
    setPrevEmployee(employee);
    setPrevMode(mode);
    if (mode === "edit" && employee) {
      setForm({
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        department_id: employee.department_id || "",
        position: employee.position || employee.Position || "",
        salary: employee.salary || "",
        hire_date: employee.hire_date || "",
        status: employee.status || "active",
      });
    } else if (mode === "add") {
      setForm({
        name: "",
        email: "",
        phone: "",
        department_id: "",
        position: "",
        salary: "",
        hire_date: "",
        status: "active",
      });
    }
  }

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const response = await api.get("/departments?limit=100");
        if (!ignore) {
          setDepartments(response.data.data || []);
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
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setErrors([]);

    try {
      if (mode === "add") {
        await api.post("/employees", form);
        notify.success("Employee added successfully!");
      } else {
        await api.patch(`/employees/${employee.id}`, form);
        notify.success("Employee details updated!");
      }

      onSuccess();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        notify.error("Please resolve validation errors below.");
      } else {
        const msg = error.response?.data?.message || "Something went wrong.";
        notify.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {errors.length > 0 && (
        <div className="bg-red-100 border border-red-300 rounded-lg p-4">
          <ul className="list-disc ml-5 text-red-600">
            {errors.map((error, index) => (
              <li key={index}>{error.msg}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

        <div>
          <label className="block mb-1 font-medium">
            Name
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Phone
          </label>

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Department
          </label>

          <select
            name="department_id"
            value={form.department_id}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option value="">
              Select Department
            </option>

            {departments.map((department) => (
              <option
                key={department.id}
                value={department.id}
              >
                {department.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Position
          </label>

          <input
            type="text"
            name="position"
            value={form.position}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Salary
          </label>

          <input
            type="number"
            name="salary"
            value={form.salary}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Hire Date
          </label>

          <input
            type="date"
            name="hire_date"
            value={form.hire_date}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Status
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>

      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-3">

        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg font-medium"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
        >
          {loading
            ? "Saving..."
            : mode === "add"
            ? "Save Employee"
            : "Update Employee"}
        </button>

      </div>

    </form>
  );
}

export default EmployeeForm;