import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
} from "../../services/profileService";
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, UserIcon } from "@heroicons/react/24/outline";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const response = await getProfile();
        if (!ignore) {
          setProfile({
            name: response.data.name || "",
            email: response.data.email || "",
            phone: response.data.phone || "",
          });
        }
      } catch (error) {
        if (!ignore) {
          console.error(error);
          alert("Failed to load profile.");
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

      alert("Profile updated successfully.");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "ME";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-80 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-600 border-t-transparent"></div>
        <p className="text-sm font-medium text-slate-500">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in-scale">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        
        {/* Header Avatar Badge */}
        <div className="flex items-center gap-4 pb-6 mb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            {getInitials(profile.name)}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {profile.name || "My Account"}
            </h1>
            <p className="text-sm text-slate-500">
              Manage your personal details and contact info
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-5 h-5" />
              </div>
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <EnvelopeIcon className="w-5 h-5" />
              </div>
              <input
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <PhoneIcon className="w-5 h-5" />
              </div>
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default Profile;