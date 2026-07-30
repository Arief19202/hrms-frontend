import { NavLink, Outlet, useNavigate } from "react-router-dom";

function DashboardLayout() {
  const navigate = useNavigate();

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col shadow-lg">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-center">HRMS</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">

          {/* Management (Admin / HR) */}
          {(user?.role === "admin" || user?.role === "hr") && (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-slate-700"
                  }`
                }
              >
                🏠 Dashboard
              </NavLink>

              <NavLink
                to="/employees"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-slate-700"
                  }`
                }
              >
                👨‍💼 Employees
              </NavLink>

              <NavLink
                to="/departments"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-slate-700"
                  }`
                }
              >
                🏢 Departments
              </NavLink>

              <NavLink
                to="/attendance"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-slate-700"
                  }`
                }
              >
                🕒 Attendance
              </NavLink>

              <NavLink
                to="/leave"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-slate-700"
                  }`
                }
              >
                📄 Leave
              </NavLink>
            </>
          )}

          {/* Administration (Admin Only) */}
          {user?.role === "admin" && (
            <>
              <div className="border-t border-slate-700 my-3"></div>

              <p className="px-4 text-xs uppercase text-slate-400 font-semibold">
                Administration
              </p>

              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-slate-700"
                  }`
                }
              >
                👥 User Management
              </NavLink>
            </>
          )}

          {/* Employee Self Service */}
          <div className="border-t border-slate-700 my-3"></div>

          <p className="px-4 text-xs uppercase text-slate-400 font-semibold">
            Employee Self Service
          </p>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition ${
                isActive ? "bg-blue-600" : "hover:bg-slate-700"
              }`
            }
          >
            🙍 My Profile
          </NavLink>

          <NavLink
            to="/my-attendance"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition ${
                isActive ? "bg-blue-600" : "hover:bg-slate-700"
              }`
            }
          >
            📍 My Attendance
          </NavLink>

          <NavLink
            to="/my-leave"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition ${
                isActive ? "bg-blue-600" : "hover:bg-slate-700"
              }`
            }
          >
            📝 My Leave
          </NavLink>

        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-lg font-medium transition"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <header className="bg-white shadow-md px-8 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              HR Management System
            </h2>

            <p className="text-gray-500 text-sm">
              Manage your employees efficiently
            </p>
          </div>

          <div className="text-right">
            <p className="font-semibold text-gray-700">
              Welcome, {user?.name || "User"}
            </p>

            <p className="text-sm text-gray-500 capitalize">
              {user?.role || "Employee"}
            </p>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default DashboardLayout;