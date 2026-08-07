import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
} from "../../services/profileService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import notify from "../../utils/notify";

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
          notify.error("Failed to load profile details.");
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
      notify.success("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      notify.error(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-2xl mx-auto">

      <div className="bg-white rounded-xl shadow p-4 sm:p-8">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          My Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Name
            </label>

            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Email
            </label>

            <input
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Phone
            </label>

            <input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            disabled={saving}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Profile;