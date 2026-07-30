import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

function DashboardLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMobileOpen(false);

    navigate("/", { replace: true });
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 min-w-0 overflow-x-hidden">
      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar / Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 text-white flex flex-col shadow-lg transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo & Close button for mobile */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-center flex-1 lg:text-center">
            HRMS
          </h1>
          <button
            onClick={closeMobileMenu}
            className="lg:hidden text-slate-400 hover:text-white p-1"
            aria-label="Close Sidebar"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Management (Admin / HR) */}
          {(user?.role === "admin" || user?.role === "hr") && (
            <>
              <NavLink
                to="/dashboard"
                onClick={closeMobileMenu}
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
                onClick={closeMobileMenu}
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
                onClick={closeMobileMenu}
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
                onClick={closeMobileMenu}
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
                onClick={closeMobileMenu}
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
                onClick={closeMobileMenu}
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
            onClick={closeMobileMenu}
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
            onClick={closeMobileMenu}
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
            onClick={closeMobileMenu}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar Header */}
        <header className="bg-white shadow-md px-4 sm:px-8 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Hamburger button for mobile/tablet */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-gray-700 hover:text-blue-600 p-2 rounded-lg border border-gray-200 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                HR Management System
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm hidden sm:block">
                Manage your employees efficiently
              </p>
            </div>
          </div>

          <div className="text-right ml-auto sm:ml-0">
            <p className="font-semibold text-gray-700 text-sm sm:text-base">
              Welcome, {user?.name || "User"}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 capitalize">
              {user?.role || "Employee"}
            </p>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;