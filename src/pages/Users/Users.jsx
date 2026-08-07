import { useEffect, useState, useCallback } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  resetPassword,
} from "../../services/userService";

import api from "../../api/axios";
import UserModal from "../../components/users/UserModal";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import EmptyState from "../../components/ui/EmptyState";
import { PlusIcon, MagnifyingGlassIcon, PencilSquareIcon, KeyIcon, TrashIcon } from "@heroicons/react/24/outline";

function Users() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    let ignore = false;
    const fetchDepartments = async () => {
      try {
        const response = await api.get("/departments?limit=100");
        if (!ignore) {
          setDepartments(response.data.data || []);
        }
      } catch (err) {
        console.error("Failed to load departments for User Management:", err);
      }
    };
    fetchDepartments();
    return () => {
      ignore = true;
    };
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const response = await getUsers({
        page,
        limit: 10,
        search,
      });

      setUsers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error(error);
      alert("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const response = await getUsers({
          page,
          limit: 10,
          search,
        });
        if (!ignore) {
          setUsers(response.data);
          setPagination(response.pagination);
        }
      } catch (error) {
        if (!ignore) {
          console.error(error);
          alert("Failed to load users.");
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
  }, [page, search]);

  const handleSearch = () => {
    setPage(1);
    loadUsers();
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setOpenModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleSave = async (form) => {
    try {
      const payload = { ...form };

      if (selectedUser) {
        if (!payload.password) {
          delete payload.password;
        }
        await updateUser(selectedUser.id, payload);
        alert("User updated successfully.");
      } else {
        await createUser(payload);
        toast.success("User created successfully.");
      }

      setOpenModal(false);
      loadUsers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save user.");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete User?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteUser(id);

      toast.success("User deleted successfully.");

      loadUsers();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await updateUserStatus(user.id, !user.is_active);

      alert(
        `User ${
          !user.is_active ? "activated" : "deactivated"
        } successfully.`
      );

      loadUsers();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update user status."
      );
    }
  };

  const handleResetPassword = async (user) => {
    const password = window.prompt(
      `Enter new password for ${user.name}`
    );

    if (!password) return;

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      await resetPassword(user.id, password);

      alert("Password reset successfully.");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to reset password."
      );
    }
  };

  return (
    <div className="space-y-6 animate-in-scale">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            User Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage system access, roles, and security credentials
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New User</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <button
            onClick={handleSearch}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-4 py-3.5 whitespace-nowrap">Name</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Email</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Role</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Department</th>
                <th className="px-4 py-3.5 whitespace-nowrap">Status</th>
                <th className="px-4 py-3.5 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                      <p className="text-sm font-medium text-slate-500">Loading user accounts...</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      title="No Users Found"
                      description="Create your first user to get started."
                    />
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-900">
                      {u.name}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                      {u.email}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold capitalize bg-blue-50 text-blue-700 border border-blue-200/80">
                        {u.role}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                      {u.employees?.departments?.name || "-"}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border transition-all ${
                          u.is_active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-200/80 hover:bg-rose-100"
                        }`}
                        title="Click to toggle status"
                      >
                        {u.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <div className="inline-flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleEdit(u)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit user"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleResetPassword(u)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Reset password"
                        >
                          <KeyIcon className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <UserModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={handleSave}
          initialData={selectedUser}
          departments={departments}
        />
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-xl disabled:opacity-50 text-xs font-semibold text-slate-700 shadow-sm transition"
        >
          Previous
        </button>

        <span className="text-xs font-medium text-slate-500">
          Page {pagination.page || 1} of {pagination.totalPages || 1}
        </span>

        <button
          disabled={page >= (pagination.totalPages || 1)}
          onClick={() => setPage(page + 1)}
          className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-xl disabled:opacity-50 text-xs font-semibold text-slate-700 shadow-sm transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Users;