import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
} from "../../services/profileService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import notify from "../../utils/notify";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CheckIcon
} from "@heroicons/react/24/outline";

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const response = await getProfile();
        if (!ignore) {
          if (response.data) {
            setProfileData(response.data);
            setProfile({
              name: response.data.name || "",
              email: response.data.email || "",
              phone: response.data.phone || "",
            });
          }
        }
      } catch (error) {
        if (!ignore) {
          console.error(error);
          if (typeof notify?.error === "function") {
            notify.error("Failed to load profile details.");
          }
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

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await updateProfile(profile);

      // Also sync user name in localStorage if updated
      if (user && profile.name) {
        localStorage.setItem("user", JSON.stringify({ ...user, name: profile.name, email: profile.email }));
      }

      if (typeof notify?.success === "function") {
        notify.success("Profile details updated successfully.");
      } else {
        alert("Profile details updated successfully.");
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Failed to update profile.";
      if (typeof notify?.error === "function") {
        notify.error(msg);
      } else {
        alert(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Cover Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl shadow-xl border border-slate-800">
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 opacity-80" />

        <div className="p-6 sm:p-8 pt-0 relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Avatar Circle */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-slate-900 border-4 border-white shadow-2xl flex items-center justify-center text-indigo-400 font-extrabold text-2xl sm:text-3xl shrink-0">
              {getUserInitials(profile.name || user?.name)}
            </div>

            <div className="space-y-1 sm:pb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading text-white">
                  {profile.name || "Employee Profile"}
                </h1>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Account Active" />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase font-semibold tracking-wider">
                  {user?.role || "Employee"}
                </span>

                {profileData?.employee_code && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono font-medium">
                    🆔 {profileData.employee_code}
                  </span>
                )}

                {profileData?.departments?.name && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                    🏢 {profileData.departments.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:pb-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheckIcon className="w-4 h-4" />
              Verified Employee
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Settings & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Edit Profile Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500">Update your contact details and account settings</p>
            </div>
            <SparklesIcon className="w-5 h-5 text-indigo-500" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-sm">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="name"
                  type="text"
                  required
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  required
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <PhoneIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="phone"
                  type="text"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs rounded-xl shadow-md transition disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>Update Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Column: Employment Overview Card */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 h-fit">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Employment Overview</h2>
              <p className="text-xs text-slate-500">Official company record</p>
            </div>
            <IdentificationIcon className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="space-y-4 text-xs">
            {/* Employee Code */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-500 font-semibold uppercase">Employee Code</span>
              <span className="font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                {profileData?.employee_code || "N/A"}
              </span>
            </div>

            {/* Department */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-500 font-semibold uppercase">Department</span>
              <span className="font-bold text-slate-800">
                {profileData?.departments?.name || "General"}
              </span>
            </div>

            {/* Position */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-500 font-semibold uppercase">Position</span>
              <span className="font-bold text-slate-800">
                {profileData?.position || "Staff"}
              </span>
            </div>

            {/* Hire Date */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-500 font-semibold uppercase">Hire Date</span>
              <span className="font-mono text-slate-700">
                {profileData?.hire_date || "-"}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-500 font-semibold uppercase">Status</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {profileData?.status || "Active"}
              </span>
            </div>
          </div>

          {/* Leave Quota Card */}
          <div className="p-4 bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 rounded-2xl border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Annual Leave Entitlement</span>
              <span className="text-indigo-600">{profileData?.annual_leave_balance ?? 14} Days Free</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Used: {profileData?.used_annual_leave ?? 0} days</span>
              <span>Total: {profileData?.total_annual_leave ?? 14} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;