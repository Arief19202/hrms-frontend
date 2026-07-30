import { useEffect, useState, useCallback } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  resetPassword,
} from "../../services/userService";

import UserModal from "../../components/users/UserModal";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import EmptyState from "../../components/ui/EmptyState";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">
            User Management
          </h1>

          <p className="text-gray-500">
            Manage HRMS user accounts
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + New User
        </button>

      </div>

      {/* Search */}

      <div className="bg-white p-4 rounded-xl shadow">

        <div className="flex gap-3">

          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 flex-1"
          />

          <button
            onClick={handleSearch}
            className="bg-slate-800 text-white px-5 rounded-lg"
          >
            Search
          </button>

        </div>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 text-left">Name</th>

              <th className="p-3 text-left">Email</th>

              <th className="p-3 text-left">Role</th>

              <th className="p-3 text-left">Status</th>

              <th className="p-3 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan={5}
                  className="text-center py-10"
                >
                  Loading...
                </td>

              </tr>

            ) : users.length === 0 ? (

              <tr>
              <td colSpan={5}>
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
                  className="border-t"
                >

                  <td className="p-3">
                    {user.name}
                  </td>

                  <td className="p-3">
                    {user.email}
                  </td>

                  <td className="p-3 capitalize">
                    {user.role}
                  </td>

                  <td className="p-3">

                  <button
                    onClick={() => handleToggleStatus(user)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                      user.is_active
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </button>

                </td>

                  <td className="p-3 text-center space-x-2">

                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleResetPassword(user)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                    >
                      Reset Password
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

        <UserModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={handleSave}
          initialData={selectedUser}
        />

      </div>

      {/* Pagination */}

      <div className="flex justify-between items-center">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>

          Page {pagination.page || 1} of{" "}
          {pagination.totalPages || 1}

        </span>

        <button
          disabled={page >= (pagination.totalPages || 1)}
          onClick={() => setPage(page + 1)}
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default Users;