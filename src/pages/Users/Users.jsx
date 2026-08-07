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
import EmptyState from "../../components/ui/EmptyState";
import notify from "../../utils/notify";
import Swal from "sweetalert2";

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
      notify.error("Failed to load users.");
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
          notify.error("Failed to load users.");
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
        notify.success("User updated successfully.");
      } else {
        await createUser(payload);
        notify.success("User created successfully.");
      }

      setOpenModal(false);
      loadUsers();
    } catch (error) {
      console.error(error);
      notify.error(error.response?.data?.message || "Failed to save user.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await notify.confirmDelete({
      title: "Delete User?",
      text: "This action cannot be undone. User account will be permanently removed."
    });

    if (!confirmed) return;

    try {
      await deleteUser(id);
      notify.success("User deleted successfully.");
      loadUsers();
    } catch (error) {
      console.error(error);
      notify.error(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await updateUserStatus(user.id, !user.is_active);

      notify.success(
        `User ${
          !user.is_active ? "activated" : "deactivated"
        } successfully.`
      );

      loadUsers();
    } catch (error) {
      console.error(error);
      notify.error(
        error.response?.data?.message ||
          "Failed to update user status."
      );
    }
  };

  const handleResetPassword = async (user) => {
    const { value: password } = await Swal.fire({
      title: `Reset Password for ${user.name}`,
      input: "password",
      inputLabel: "New Password",
      inputPlaceholder: "Enter new password (min. 6 characters)",
      inputAttributes: {
        minlength: "6",
        autocapitalize: "off",
        autocorrect: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Reset Password",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#64748b",
      background: "#0f172a",
      color: "#f8fafc",
      customClass: {
        popup: "rounded-2xl border border-slate-800 shadow-2xl",
        confirmButton: "px-5 py-2.5 rounded-xl font-medium text-sm shadow-md",
        cancelButton: "px-5 py-2.5 rounded-xl font-medium text-sm shadow-md",
      },
    });

    if (!password) return;

    if (password.length < 6) {
      notify.warning("Password must be at least 6 characters.");
      return;
    }

    try {
      await resetPassword(user.id, password);
      notify.success(`Password for ${user.name} reset successfully.`);
    } catch (error) {
      console.error(error);
      notify.error(
        error.response?.data?.message ||
        "Failed to reset password."
      );
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            User Management
          </h1>

          <p className="text-gray-500 text-sm sm:text-base">
            Manage HRMS user accounts
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-medium"
        >
          + New User
        </button>

      </div>

      {/* Search */}

      <div className="bg-white p-4 sm:p-5 rounded-xl shadow">

        <div className="flex flex-col sm:flex-row gap-3">

          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:flex-1 border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />

          <button
            onClick={handleSearch}
            className="w-full sm:w-auto bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium"
          >
            Search
          </button>

        </div>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-3 text-left whitespace-nowrap">Name</th>

                <th className="p-3 text-left whitespace-nowrap">Email</th>

                <th className="p-3 text-left whitespace-nowrap">Role</th>

                <th className="p-3 text-left whitespace-nowrap">Department</th>

                <th className="p-3 text-left whitespace-nowrap">Status</th>

                <th className="p-3 text-center whitespace-nowrap">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan={6}
                    className="text-center py-10"
                  >
                    Loading...
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

                users.map((user) => (

                  <tr
                    key={user.id}
                    className="border-t text-sm sm:text-base hover:bg-gray-50"
                  >

                    <td className="p-3 whitespace-nowrap font-medium text-gray-900">
                      {user.name}
                    </td>

                    <td className="p-3 whitespace-nowrap text-gray-600">
                      {user.email}
                    </td>

                    <td className="p-3 capitalize whitespace-nowrap font-medium">
                      {user.role}
                    </td>

                    <td className="p-3 whitespace-nowrap text-gray-600">
                      {user.employees?.departments?.name || "-"}
                    </td>

                    <td className="p-3 whitespace-nowrap">

                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition ${
                          user.is_active
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </button>

                    </td>

                    <td className="p-3 text-center whitespace-nowrap">

                      <div className="inline-flex gap-2 flex-wrap justify-center">

                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-yellow-600"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleResetPassword(user)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-xs sm:text-sm"
                        >
                          Reset Password
                        </button>

                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs sm:text-sm"
                        >
                          Delete
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

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded disabled:opacity-50 text-sm font-medium"
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">

          Page {pagination.page || 1} of{" "}
          {pagination.totalPages || 1}

        </span>

        <button
          disabled={page >= (pagination.totalPages || 1)}
          onClick={() => setPage(page + 1)}
          className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded disabled:opacity-50 text-sm font-medium"
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default Users;