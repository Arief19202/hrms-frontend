import { useEffect, useState } from "react";
import api from "../../api/axios";

import EmployeeTable from "../../components/employee/EmployeeTable";
import EmployeeSearch from "../../components/employee/EmployeeSearch";
import EmployeePagination from "../../components/employee/EmployeePagination";
import EmployeeModal from "../../components/employee/EmployeeModal";
import EmployeeForm from "../../components/employee/EmployeeForm";
import DeleteEmployeeModal from "../../components/employee/DeleteEmployeeModal";

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [mode, setMode] = useState("add");

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [deleteModal, setDeleteModal] = useState(false);

  const fetchEmployees = async (page = 1, keyword = "") => {
    try {
      setError("");

      const response = await api.get(
        `/employees?page=${page}&search=${keyword}`
      );

      setEmployees(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error(err);
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const response = await api.get("/employees?page=1&search=");
        if (!ignore) {
          setError("");
          setEmployees(response.data.data);
          setPagination(response.data.pagination);
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setError("Failed to load employees.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSearch = () => {
    setLoading(true);
    fetchEmployees(1, search);
  };

  const handlePageChange = (page) => {
    setLoading(true);
    fetchEmployees(page, search);
  };

  // ==========================
  // ADD
  // ==========================
  const handleAddEmployee = () => {
    setMode("add");
    setSelectedEmployee(null);
    setOpenModal(true);
  };

  // ==========================
  // EDIT
  // ==========================
  const handleEditEmployee = (employee) => {
    setMode("edit");
    setSelectedEmployee(employee);
    setOpenModal(true);
  };

  // ==========================
  // DELETE
  // ==========================
  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setDeleteModal(true);
  };

  const handleDeleteEmployee = async () => {
    try {
      await api.delete(`/employees/${selectedEmployee.id}`);

      setDeleteModal(false);
      setSelectedEmployee(null);

      fetchEmployees(pagination.page, search);

      alert("Employee deleted successfully.");

    } catch (error) {
      console.error(error);
      alert("Failed to delete employee.");
    }
  };

  // ==========================
  // AFTER ADD / EDIT
  // ==========================
  const handleSuccess = () => {
    setOpenModal(false);
    setSelectedEmployee(null);

    fetchEmployees(pagination.page, search);
  };

  if (loading) {
    return (
      <div className="text-center text-xl font-semibold">
        Loading Employees...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Employee Management
          </h1>

          <p className="text-gray-500 text-sm sm:text-base">
            Manage all employees in the system
          </p>
        </div>

        <button
          onClick={handleAddEmployee}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
        >
          + Add Employee
        </button>

      </div>

      {/* Search */}
      <EmployeeSearch
        search={search}
        setSearch={setSearch}
        onSearch={handleSearch}
      />

      {/* Table */}
      <EmployeeTable
        employees={employees}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteClick}
      />

      {/* Pagination */}
      <EmployeePagination
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {/* Add / Edit Modal */}
      <EmployeeModal
        open={openModal}
        title={
          mode === "add"
            ? "Add Employee"
            : "Edit Employee"
        }
        onClose={() => {
          setOpenModal(false);
          setSelectedEmployee(null);
        }}
      >
        <EmployeeForm
          mode={mode}
          employee={selectedEmployee}
          onSuccess={handleSuccess}
          onCancel={() => {
            setOpenModal(false);
            setSelectedEmployee(null);
          }}
        />
      </EmployeeModal>

      {/* Delete Modal */}
      <DeleteEmployeeModal
        open={deleteModal}
        employee={selectedEmployee}
        onClose={() => {
          setDeleteModal(false);
          setSelectedEmployee(null);
        }}
        onConfirm={handleDeleteEmployee}
      />

    </div>
  );
}

export default Employee;