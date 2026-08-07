import { useState } from "react";
import api from "../../api/axios";

function DepartmentForm({
  mode = "add",
  department = null,
  onSuccess,
  onCancel,
}) {
  const [prevDepartment, setPrevDepartment] = useState(null);
  const [prevMode, setPrevMode] = useState(mode);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  if (department !== prevDepartment || mode !== prevMode) {
    setPrevDepartment(department);
    setPrevMode(mode);
    if (mode === "edit" && department) {
      setForm({
        name: department.name || "",
        description: department.description || "",
      });
    } else if (mode === "add") {
      setForm({
        name: "",
        description: "",
      });
    }
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!form.name.trim()) {
      alert("Department name is required.");
      return;
    }

    try {
      setLoading(true);

      if (mode === "add") {
        await api.post("/departments", form);
      } else {
        await api.patch(
          `/departments/${department.id}`,
          form
        );
      }

      onSuccess();

    } catch (error) {
      console.error(error);

      alert("Failed to save department.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

      {/* Department Name */}
      <div>

        <label className="block mb-2 font-medium">
          Department Name
        </label>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Department Name"
          className="w-full border rounded-lg px-4 py-3"
          required
        />

      </div>

      {/* Description */}
      <div>

        <label className="block mb-2 font-medium">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          placeholder="Department Description"
          className="w-full border rounded-lg px-4 py-3"
        />

      </div>

      {/* Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">

        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-5 py-3 rounded-lg font-medium"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium"
        >
          {loading
            ? "Saving..."
            : mode === "add"
            ? "Add Department"
            : "Update Department"}
        </button>

      </div>

    </form>
  );
}

export default DepartmentForm;