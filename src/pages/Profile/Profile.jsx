import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
} from "../../services/profileService";

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

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">

      <div className="bg-white rounded-xl shadow p-8">

        <h1 className="text-3xl font-bold mb-6">
          My Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="block mb-2 font-medium">
              Name
            </label>

            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Phone
            </label>

            <input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <button
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Profile;