import { useEffect, useState } from "react";
import api from "../../api/axios";
import { PlusIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

import EmployeeTable from "../../components/employee/EmployeeTable";
import EmployeeSearch from "../../components/employee/EmployeeSearch";
import EmployeePagination from "../../components/employee/EmployeePagination";
import EmployeeModal from "../../components/employee/EmployeeModal";
import EmployeeForm from "../../components/employee/EmployeeForm";
import DeleteEmployeeModal from "../../components/employee/DeleteEmployeeModal";

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
  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setDeleteModal(true);
  };

  const handleDeleteEmployee = async () => {
    try {
      await api.delete(`/employees/${selectedEmployee.id}`);

      setDeleteModal(false);
      setSelectedEmployee(null);

      fetchEmployees(pagination.page || 1, search, departmentFilter, statusFilter);

      toast.success("Employee deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete employee.");
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
      <div className="flex flex-col justify-center items-center h-80 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-600 border-t-transparent"></div>
        <p className="text-sm font-medium text-slate-500">Loading employees...</p>
      </div>
    );
  }

  if (error && !employees.length) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in-scale">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Employee Directory
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage company workforce, roles, and profiles
          </p>
        </div>

        <button
          onClick={handleAddEmployee}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Employee</span>
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
        title={mode === "add" ? "Add New Employee" : "Edit Employee Details"}
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