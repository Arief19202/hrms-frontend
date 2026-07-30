import { useState } from "react";

function UserModal({
  open,
  onClose,
  onSubmit,
  initialData,
}) {
  const [prevData, setPrevData] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  if (initialData !== prevData) {
    setPrevData(initialData);
    setForm({
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "",
      role: initialData?.role || "employee",
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

          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

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
            className="w-full border rounded-lg p-3"
            required={!initialData}
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option value="admin">Admin</option>
            <option value="hr">HR</option>
            <option value="employee">Employee</option>
          </select>

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