import { useState } from "react";

function UserModal({
  open,
  onClose,
  onSubmit,
  initialData,
  departments = [],
}) {
  const [prevData, setPrevData] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    department_id: "",
  });

  if (initialData !== prevData) {
    setPrevData(initialData);
    setForm({
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "",
      role: initialData?.role || "employee",
      department_id: initialData?.employees?.department_id || initialData?.department_id || "",
    });
  }

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">

      <div className="bg-white rounded-xl w-full max-w-md mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">

        <h2 className="text-xl sm:text-2xl font-bold mb-5">
          {initialData ? "Edit User" : "New User"}
        </h2>

        <form
          onSubmit={submit}
          className="space-y-4"
        >

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Name
            </label>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Email
            </label>
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder={
                initialData
                  ? "Leave blank to keep password"
                  : "Password"
              }
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 text-sm sm:text-base"
              required={!initialData}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 text-sm sm:text-base bg-white"
            >
              <option value="admin">Admin</option>
              <option value="hr">HR</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Department
            </label>
            <select
              name="department_id"
              value={form.department_id}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 text-sm sm:text-base bg-white"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-3">

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Save
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default UserModal;