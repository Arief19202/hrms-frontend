import { useEffect, useState } from "react";
import api from "../../api/axios";
import { PlusIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

import AttendanceTable from "../../components/attendance/AttendanceTable";
import AttendanceSearch from "../../components/attendance/AttendanceSearch";
import AttendancePagination from "../../components/attendance/AttendancePagination";
import AttendanceModal from "../../components/attendance/AttendanceModal";
import AttendanceForm from "../../components/attendance/AttendanceForm";
import DeleteAttendanceModal from "../../components/attendance/DeleteAttendanceModal";

function Attendance() {
  const [attendances, setAttendances] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalRecords: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [mode, setMode] = useState("add");

  const [selectedAttendance, setSelectedAttendance] = useState(null);

  const fetchAttendances = async (page = 1, keyword = "") => {
    try {
      const response = await api.get(
        `/attendances?page=${page}&search=${keyword}`
      );

      setError("");
      setAttendances(response.data.data || []);

      setPagination(
        response.data.pagination || {
          page: 1,
          totalPages: 1,
          totalRecords: response.data.data?.length || 0,
        }
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load attendances.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const response = await api.get("/attendances?page=1&search=");
        if (!ignore) {
          setError("");
          setAttendances(response.data.data || []);
          setPagination(
            response.data.pagination || {
              page: 1,
              totalPages: 1,
              totalRecords: response.data.data?.length || 0,
            }
          );
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setError("Failed to load attendances.");
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
    fetchAttendances(1, search);
  };

  const handlePageChange = (page) => {
    setLoading(true);
    fetchAttendances(page, search);
  };

  const handleAddAttendance = () => {
    setMode("add");
    setSelectedAttendance(null);
    setOpenModal(true);
  };

  const handleEditAttendance = (attendance) => {
    setMode("edit");
    setSelectedAttendance(attendance);
    setOpenModal(true);
  };

  const handleDeleteClick = (attendance) => {
    setSelectedAttendance(attendance);
    setDeleteModal(true);
  };

  const handleDeleteAttendance = async () => {
    try {
      await api.delete(`/attendances/${selectedAttendance.id}`);
      setDeleteModal(false);
      setSelectedAttendance(null);
      fetchAttendances(pagination.page || 1, search);
      toast.success("Attendance deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete attendance.");
    }
  };

  const handleSuccess = () => {
    setOpenModal(false);
    setSelectedAttendance(null);
    fetchAttendances(pagination.page || 1, search);
  };

  if (loading && !attendances.length) {
    return (
      <div className="flex flex-col justify-center items-center h-80 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-600 border-t-transparent"></div>
        <p className="text-sm font-medium text-slate-500">Loading attendance records...</p>
      </div>
    );
  }

  if (error && !attendances.length) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in-scale">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Attendance Log
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitor and record daily employee check-ins and check-outs
          </p>
        </div>

        <button
          onClick={handleAddAttendance}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Record Attendance</span>
        </button>
      </div>

      <AttendanceSearch
        search={search}
        setSearch={setSearch}
        onSearch={handleSearch}
      />

      <AttendanceTable
        attendances={attendances}
        onEdit={handleEditAttendance}
        onDelete={handleDeleteClick}
      />

      <AttendancePagination
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      <AttendanceModal
        open={openModal}
        title={
          mode === "add"
            ? "Add Attendance"
            : "Edit Attendance"
        }
        onClose={() => {
          setOpenModal(false);
          setSelectedAttendance(null);
        }}
      >
        <AttendanceForm
          mode={mode}
          attendance={selectedAttendance}
          onSuccess={handleSuccess}
          onCancel={() => {
            setOpenModal(false);
            setSelectedAttendance(null);
          }}
        />
      </AttendanceModal>

      <DeleteAttendanceModal
        open={deleteModal}
        attendance={selectedAttendance}
        onClose={() => {
          setDeleteModal(false);
          setSelectedAttendance(null);
        }}
        onConfirm={handleDeleteAttendance}
      />

    </div>
  );
}

export default Attendance;