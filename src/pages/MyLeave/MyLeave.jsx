import { useEffect, useState, useCallback } from "react";
import {
  getMyLeaves,
  applyLeave,
} from "../../services/myLeaveService";
import { getProfile } from "../../services/profileService";

function MyLeave() {
  const [leaves, setLeaves] = useState([]);
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    leave_type: "annual",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const loadLeaves = useCallback(async () => {
    try {
      const [leaveRes, profileRes] = await Promise.all([
        getMyLeaves(),
        getProfile().catch(() => ({ data: null })),
      ]);

      setLeaves(leaveRes.data || []);
      if (profileRes.data) {
        setProfile(profileRes.data);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load leave records.");
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const [leaveRes, profileRes] = await Promise.all([
          getMyLeaves(),
          getProfile().catch(() => ({ data: null })),
        ]);

        if (!ignore) {
          setLeaves(leaveRes.data || []);
          if (profileRes.data) {
            setProfile(profileRes.data);
          }
        }
      } catch (error) {
        if (!ignore) {
          console.error(error);
          alert("Failed to load leave records.");
        }
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];

  const handleStartDateChange = (val) => {
    let newEndDate = form.end_date;
    if (!newEndDate || newEndDate < val) {
      newEndDate = val;
    }
    setForm((prev) => ({
      ...prev,
      start_date: val,
      end_date: newEndDate,
    }));
  };

  const calculateDays = () => {
    if (!form.start_date || !form.end_date) return null;
    const start = new Date(form.start_date);
    const end = new Date(form.end_date);
    if (isNaN(start) || isNaN(end) || end < start) return null;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const daysCount = calculateDays();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.start_date || !form.end_date) {
      alert("Please select both start date and end date.");
      return;
    }

    if (form.end_date < form.start_date) {
      alert("End date cannot be earlier than start date.");
      return;
    }

    try {
      await applyLeave(form);

      alert("Leave request submitted successfully.");

      setForm({
        leave_type: "annual",
        start_date: "",
        end_date: "",
        reason: "",
      });

      loadLeaves();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to submit leave."
      );
    }
  };

  return (
    <div className="space-y-8">

      {/* Annual Leave Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

        <div className="bg-white rounded-xl shadow p-4 sm:p-6 border-l-4 border-blue-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Annual Leave</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
              {profile?.total_annual_leave ?? 14} <span className="text-xs sm:text-sm font-normal text-gray-500">Days</span>
            </h3>
          </div>
          <div className="text-2xl sm:text-3xl">📅</div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 sm:p-6 border-l-4 border-orange-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs sm:text-sm font-medium">Used Annual Leave</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
              {profile?.used_annual_leave ?? 0} <span className="text-xs sm:text-sm font-normal text-gray-500">Days</span>
            </h3>
          </div>
          <div className="text-2xl sm:text-3xl">⏳</div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 sm:p-6 border-l-4 border-green-500 flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-gray-500 text-xs sm:text-sm font-medium">Remaining AL Balance</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
              {profile?.annual_leave_balance ?? 14} <span className="text-xs sm:text-sm font-normal text-gray-500">Days</span>
            </h3>
          </div>
          <div className="text-2xl sm:text-3xl">🌴</div>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow p-4 sm:p-6">

        <h2 className="text-xl sm:text-2xl font-bold mb-5 text-gray-800">
          Apply Leave
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leave Type
            </label>
            <select
              value={form.leave_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  leave_type: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            >
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="emergency">Emergency Leave</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              min={todayStr}
              value={form.start_date}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full border rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              min={form.start_date || todayStr}
              value={form.end_date}
              onChange={(e) =>
                setForm({
                  ...form,
                  end_date: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <input
              type="text"
              placeholder="Reason for leave"
              value={form.reason}
              onChange={(e) =>
                setForm({
                  ...form,
                  reason: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          {daysCount !== null && (
            <div className="col-span-1 sm:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between text-blue-800">
              <span className="font-medium text-sm">
                Selected Duration:
              </span>
              <span className="font-bold text-sm sm:text-base bg-blue-600 text-white px-3 py-1 rounded-full">
                {daysCount} {daysCount === 1 ? "Day" : "Days"}
              </span>
            </div>
          )}

          <div className="col-span-1 sm:col-span-2 pt-2">

            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow hover:shadow-md transition-all"
            >
              Submit Leave Request
            </button>

          </div>

        </form>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-3 text-left whitespace-nowrap">Type</th>

                <th className="p-3 whitespace-nowrap">Start</th>

                <th className="p-3 whitespace-nowrap">End</th>

                <th className="p-3 whitespace-nowrap">Status</th>

                <th className="p-3 whitespace-nowrap">Days</th>

              </tr>

            </thead>

            <tbody>

              {leaves.length === 0 ? (

                <tr>

                  <td
                    colSpan={5}
                    className="text-center py-10 text-gray-500"
                  >
                    No leave records.
                  </td>

                </tr>

              ) : (

                leaves.map((leave) => (

                  <tr
                    key={leave.id}
                    className="border-t text-sm sm:text-base hover:bg-gray-50"
                  >

                    <td className="p-3 capitalize whitespace-nowrap font-medium text-gray-900">
                      {leave.leave_type}
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      {leave.start_date}
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      {leave.end_date}
                    </td>

                    <td className="p-3 whitespace-nowrap">

                      <span
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                          leave.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : leave.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {leave.status}
                      </span>

                    </td>

                    <td className="p-3 whitespace-nowrap">
                      {leave.total_days}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default MyLeave;