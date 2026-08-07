import { useEffect, useState } from "react";
import api from "../../api/axios";
import notify from "../../utils/notify";

import DepartmentTable from "../../components/department/DepartmentTable";
import DepartmentSearch from "../../components/department/DepartmentSearch";
import DepartmentPagination from "../../components/department/DepartmentPagination";
import DepartmentModal from "../../components/department/DepartmentModal";
import DepartmentForm from "../../components/department/DepartmentForm";
import DeleteDepartmentModal from "../../components/department/DeleteDepartmentModal";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

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
      notify.error("Failed to load departments.");
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
          notify.error("Failed to load departments.");
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
  const handleDeleteClick = async (department) => {
    const confirmed = await notify.confirmDelete({
      title: "Delete Department",
      text: `Are you sure you want to delete ${department.name}? This action cannot be undone.`
    });

    if (!confirmed) return;

    try {
      await api.delete(`/departments/${department.id}`);
      await fetchDepartments(1, search);
      notify.success("Department deleted successfully.");
    } catch (err) {
      console.error(err);
      notify.error("Failed to delete department.");
    }
  };

  const handleDeleteDepartment = async () => {
    try {
      await api.delete(`/departments/${selectedDepartment.id}`);
      setDeleteModal(false);
      setSelectedDepartment(null);
      await fetchDepartments(1, search);
      notify.success("Department deleted successfully.");
    } catch (err) {
      console.error(err);
      notify.error("Failed to delete department.");
    }
  };

  // AFTER SAVE
  const handleSuccess = async () => {
    setOpenModal(false);
    setSelectedDepartment(null);

    await fetchDepartments(1, search);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 rounded-lg p-4">
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
            Department Management
          </h1>

          <p className="text-gray-500 text-sm sm:text-base">
            Manage all departments in the system
          </p>
        </div>

        <button
          onClick={handleAddDepartment}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
        >
          + Add Department
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