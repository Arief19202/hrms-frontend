import { useEffect, useState } from "react";
import api from "../../api/axios";
import notify from "../../utils/notify";

import EmployeeTable from "../../components/employee/EmployeeTable";
import EmployeeSearch from "../../components/employee/EmployeeSearch";
import EmployeePagination from "../../components/employee/EmployeePagination";
import EmployeeModal from "../../components/employee/EmployeeModal";
import EmployeeForm from "../../components/employee/EmployeeForm";
import DeleteEmployeeModal from "../../components/employee/DeleteEmployeeModal";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({});
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const fetchEmployees = async (
    page = 1,
    keyword = search,
    deptId = departmentFilter,
    statusVal = statusFilter
  ) => {
    try {
      setError("");

      const params = new URLSearchParams();
      params.append("page", page);
      if (keyword) params.append("search", keyword);
      if (deptId) params.append("department_id", deptId);
      if (statusVal) params.append("status", statusVal);

      const response = await api.get(`/employees?${params.toString()}`);
      setEmployees(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error(err);
      setError("Failed to load employees.");
      notify.error("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  // Load departments list & initial employees
  useEffect(() => {
    let ignore = false;
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError("");

        const [deptsRes, empsRes] = await Promise.all([
          api.get("/departments?limit=100"),
          api.get("/employees?page=1")
        ]);

        if (!ignore) {
          setDepartments(deptsRes.data.data || []);
          setEmployees(empsRes.data.data || []);
          setPagination(empsRes.data.pagination || {});
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setError("Failed to load initial data.");
          notify.error("Failed to load initial employee data.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadInitialData();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSearch = () => {
    setLoading(true);
    fetchEmployees(1, search, departmentFilter, statusFilter);
  };

  const handleDepartmentChange = (deptId) => {
    setDepartmentFilter(deptId);
    setLoading(true);
    fetchEmployees(1, search, deptId, statusFilter);
  };

  const handleStatusChange = (statusVal) => {
    setStatusFilter(statusVal);
    setLoading(true);
    fetchEmployees(1, search, departmentFilter, statusVal);
  };

  const handleResetFilters = () => {
    setSearch("");
    setDepartmentFilter("");
    setStatusFilter("");
    setLoading(true);
    fetchEmployees(1, "", "", "");
  };

  const handlePageChange = (page) => {
    setLoading(true);
    fetchEmployees(page, search, departmentFilter, statusFilter);
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
  const handleDeleteClick = async (employee) => {
    const confirmed = await notify.confirmDelete({
      title: "Delete Employee",
      text: `Are you sure you want to delete ${employee.name}? This action cannot be undone.`
    });

    if (!confirmed) return;

    try {
      await api.delete(`/employees/${employee.id}`);
      fetchEmployees(pagination.page || 1, search, departmentFilter, statusFilter);
      notify.success("Employee deleted successfully.");
    } catch (error) {
      console.error(error);
      notify.error("Failed to delete employee.");
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      await api.delete(`/selectedEmployee.id`);
      setDeleteModal(false);
      setSelectedEmployee(null);
      fetchEmployees(pagination.page || 1, search, departmentFilter, statusFilter);
      notify.success("Employee deleted successfully.");
    } catch (error) {
      console.error(error);
      notify.error("Failed to delete employee.");
    }
  };

  // ==========================
  // AFTER ADD / EDIT
  // ==========================
  const handleSuccess = () => {
    setOpenModal(false);
    setSelectedEmployee(null);

    fetchEmployees(pagination.page || 1, search, departmentFilter, statusFilter);
  };

  if (loading && !employees.length) {
    return (
      <div className="text-center text-xl font-semibold p-8">
        Loading Employees...
      </div>
    );
  }

  if (error && !employees.length) {
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

      {/* Filter / Search Bar */}
      <EmployeeSearch
        search={search}
        setSearch={setSearch}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        departments={departments}
        onSearch={handleSearch}
        onDepartmentChange={handleDepartmentChange}
        onStatusChange={handleStatusChange}
        onReset={handleResetFilters}
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
        title={mode === "add" ? "Add Employee" : "Edit Employee"}
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