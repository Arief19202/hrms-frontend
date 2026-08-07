import { useEffect, useState } from "react";
import api from "../../api/axios";
import { PlusIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

import DepartmentTable from "../../components/department/DepartmentTable";
import DepartmentSearch from "../../components/department/DepartmentSearch";
import DepartmentPagination from "../../components/department/DepartmentPagination";
import DepartmentModal from "../../components/department/DepartmentModal";
import DepartmentForm from "../../components/department/DepartmentForm";
import DeleteDepartmentModal from "../../components/department/DeleteDepartmentModal";

function Department() {
  const [departments, setDepartments] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [mode, setMode] = useState("add");
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const fetchDepartments = async (page = 1, keyword = "") => {
    try {
      setError("");

      const response = await api.get(
        `/departments?page=${page}&search=${keyword}`
      );

      setDepartments(response.data.data || []);

      // Backend sekarang belum ada pagination
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      } else {
        setPagination({
          page: 1,
          totalPages: 1,
          total: response.data.data?.length || 0,
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const response = await api.get("/departments?page=1&search=");
        if (!ignore) {
          setError("");
          setDepartments(response.data.data || []);
          if (response.data.pagination) {
            setPagination(response.data.pagination);
          } else {
            setPagination({
              page: 1,
              totalPages: 1,
              total: response.data.data?.length || 0,
            });
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setError("Failed to load departments.");
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
    fetchDepartments(1, search);
  };

  const handlePageChange = (page) => {
    setLoading(true);
    fetchDepartments(page, search);
  };

  // ADD
  const handleAddDepartment = () => {
    setMode("add");
    setSelectedDepartment(null);
    setOpenModal(true);
  };

  // EDIT
  const handleEditDepartment = (department) => {
    setMode("edit");
    setSelectedDepartment(department);
    setOpenModal(true);
  };

  // DELETE
  const handleDeleteClick = (department) => {
    setSelectedDepartment(department);
    setDeleteModal(true);
  };

  const handleDeleteDepartment = async () => {
    try {
      await api.delete(`/departments/${selectedDepartment.id}`);

      setDeleteModal(false);
      setSelectedDepartment(null);

      await fetchDepartments(1, search);

      toast.success("Department deleted successfully.");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete department.");
    }
  };

  // AFTER SAVE
  const handleSuccess = async () => {
    setOpenModal(false);
    setSelectedDepartment(null);

    await fetchDepartments(1, search);
  };

  if (loading && !departments.length) {
    return (
      <div className="flex flex-col justify-center items-center h-80 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-600 border-t-transparent"></div>
        <p className="text-sm font-medium text-slate-500">Loading departments...</p>
      </div>
    );
  }

  if (error && !departments.length) {
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
            Department Directory
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Organize company structure and departmental units
          </p>
        </div>

        <button
          onClick={handleAddDepartment}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Search */}
      <DepartmentSearch
        search={search}
        setSearch={setSearch}
        onSearch={handleSearch}
      />

      {/* Table */}
      <DepartmentTable
        departments={departments}
        onEdit={handleEditDepartment}
        onDelete={handleDeleteClick}
      />

      {/* Pagination */}
      <DepartmentPagination
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {/* Add / Edit */}
      <DepartmentModal
        open={openModal}
        title={
          mode === "add"
            ? "Add Department"
            : "Edit Department"
        }
        onClose={() => {
          setOpenModal(false);
          setSelectedDepartment(null);
        }}
      >
        <DepartmentForm
          mode={mode}
          department={selectedDepartment}
          onSuccess={handleSuccess}
          onCancel={() => {
            setOpenModal(false);
            setSelectedDepartment(null);
          }}
        />
      </DepartmentModal>

      {/* Delete */}
      <DeleteDepartmentModal
        open={deleteModal}
        department={selectedDepartment}
        onClose={() => {
          setDeleteModal(false);
          setSelectedDepartment(null);
        }}
        onConfirm={handleDeleteDepartment}
      />
    </div>
  );
}

export default Department;