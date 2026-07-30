import { useEffect, useState } from "react";
import api from "../../api/axios";

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

      await fetchAttendances(1, search);

      alert("Attendance deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete attendance.");
    }
  };

  const handleSuccess = async () => {
    setOpenModal(false);
    setSelectedAttendance(null);

    await fetchAttendances(1, search);
  };

  if (loading) {
    return (
      <div className="text-center text-xl font-semibold">
        Loading Attendances...
      </div>
    );
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Attendance Management
          </h1>

          <p className="text-gray-500 text-sm sm:text-base">
            Manage employee attendance records
          </p>
        </div>

        <button
          onClick={handleAddAttendance}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
        >
          + Add Attendance
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