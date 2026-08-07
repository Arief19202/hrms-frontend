import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ClockIcon,
  DocumentTextIcon,
  UserCircleIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

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

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getNavClass = (isActive) =>
    `group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
        : "text-slate-300 hover:text-white hover:bg-slate-800/80"
    }`;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 min-w-0 overflow-x-hidden">
      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar / Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800/80 shadow-2xl transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo & Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
                HRMS Portal
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                Enterprise
              </span>
            </div>
          </div>
          <button
            onClick={closeMobileMenu}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            aria-label="Close Sidebar"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
          {/* Management (Admin / HR) */}
          {(user?.role === "admin" || user?.role === "hr") && (
            <>
              <div className="px-3 pb-1 pt-1">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  Management
                </p>
              </div>

              <NavLink
                to="/dashboard"
                onClick={closeMobileMenu}
                className={({ isActive }) => getNavClass(isActive)}
              >
                <HomeIcon className="w-5 h-5 shrink-0" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/employees"
                onClick={closeMobileMenu}
                className={({ isActive }) => getNavClass(isActive)}
              >
                <UsersIcon className="w-5 h-5 shrink-0" />
                <span>Employees</span>
              </NavLink>

              <NavLink
                to="/departments"
                onClick={closeMobileMenu}
                className={({ isActive }) => getNavClass(isActive)}
              >
                <BuildingOfficeIcon className="w-5 h-5 shrink-0" />
                <span>Departments</span>
              </NavLink>

              <NavLink
                to="/attendance"
                onClick={closeMobileMenu}
                className={({ isActive }) => getNavClass(isActive)}
              >
                <ClockIcon className="w-5 h-5 shrink-0" />
                <span>Attendance</span>
              </NavLink>

              <NavLink
                to="/leave"
                onClick={closeMobileMenu}
                className={({ isActive }) => getNavClass(isActive)}
              >
                <DocumentTextIcon className="w-5 h-5 shrink-0" />
                <span>Leave Requests</span>
              </NavLink>
            </>
          )}

          {/* Administration (Admin Only) */}
          {user?.role === "admin" && (
            <>
              <div className="pt-4 px-3 pb-1">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  Administration
                </p>
              </div>

              <NavLink
                to="/users"
                onClick={closeMobileMenu}
                className={({ isActive }) => getNavClass(isActive)}
              >
                <UserGroupIcon className="w-5 h-5 shrink-0" />
                <span>User Management</span>
              </NavLink>
            </>
          )}

          {/* Employee Self Service */}
          <div className="pt-4 px-3 pb-1">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              Self Service
            </p>
          </div>

          <NavLink
            to="/profile"
            onClick={closeMobileMenu}
            className={({ isActive }) => getNavClass(isActive)}
          >
            <UserCircleIcon className="w-5 h-5 shrink-0" />
            <span>My Profile</span>
          </NavLink>

          <NavLink
            to="/my-attendance"
            onClick={closeMobileMenu}
            className={({ isActive }) => getNavClass(isActive)}
          >
            <MapPinIcon className="w-5 h-5 shrink-0" />
            <span>My Attendance</span>
          </NavLink>

          <NavLink
            to="/my-leave"
            onClick={closeMobileMenu}
            className={({ isActive }) => getNavClass(isActive)}
          >
            <CalendarDaysIcon className="w-5 h-5 shrink-0" />
            <span>My Leave</span>
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-rose-600/90 text-slate-300 hover:text-white py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-200 border border-slate-700/50 hover:border-transparent group shadow-sm"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Glass Navbar Header */}
        <header className="sticky top-0 z-30 glass-header border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-all">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-slate-600 hover:text-slate-900 p-2 rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 focus:outline-none transition"
              aria-label="Toggle Menu"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                HR Management System
              </h2>
              <p className="text-slate-500 text-xs hidden sm:block">
                Streamlined Operations & Employee Portal
              </p>
            </div>
          </div>

          {/* User profile info pill */}
          <div className="flex items-center gap-3 pl-3">
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-slate-900 text-sm leading-snug">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] font-medium text-blue-600 uppercase tracking-wide">
                {user?.role || "Employee"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-blue-500/20 ring-2 ring-white">
              {getInitials(user?.name)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;