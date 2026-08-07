import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ClockIcon,
  DocumentTextIcon,
  UsersIcon,
  UserIcon,
  MapPinIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  SparklesIcon,
  BuildingOffice2Icon
} from "@heroicons/react/24/outline";

import api from "../api/axios";
import notify from "../utils/notify";

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const userKey = user?.id || "guest";

  useEffect(() => {
    const dateStr = new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    setCurrentDate(dateStr);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMobileOpen(false);
    navigate("/", { replace: true });
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  // Helper for page title based on path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard Overview";
    if (path === "/employees") return "Employee Directory";
    if (path === "/departments") return "Departments";
    if (path === "/attendance") return "Attendance Tracker";
    if (path === "/leave") return "Leave Requests";
    if (path === "/users") return "User Management";
    if (path === "/profile") return "My Profile";
    if (path === "/my-attendance") return "My Attendance Logs";
    if (path === "/my-leave") return "My Leave Applications";
    return "HR Portal";
  };

  const navItemClass = (isActive) =>
    `group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
      isActive
        ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 font-semibold"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
    }`;

  const renderActiveIndicator = (isActive) =>
    isActive ? (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-r-full shadow-glow" />
    ) : null;

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Dynamic Notifications Engine
  const [rawNotifs, setRawNotifs] = useState([]);
  const [readNotifIds, setReadNotifIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`hrms_read_notifs_${userKey}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadRealNotifications = async () => {
      try {
        const notifList = [];

        // 1. Fetch Leaves for HR/Admin or Employee
        if (user?.role === "admin" || user?.role === "hr") {
          const res = await api.get("/leaves").catch(() => null);
          if (res?.data?.data) {
            const leaves = res.data.data;
            leaves.slice(0, 10).forEach((item) => {
              const empName = item.employees?.name || "Employee";
              const typeStr = item.leave_type
                ? item.leave_type.toUpperCase()
                : "LEAVE";

              let title = `📄 ${empName} applied for ${typeStr}`;
              let message = `Requested leave from ${item.start_date} to ${item.end_date} (Status: ${item.status || "pending"})`;

              if (item.status === "approved") {
                title = `✅ ${empName}'s ${typeStr} Approved`;
                message = `Leave request from ${item.start_date} to ${item.end_date} has been Approved`;
              } else if (item.status === "rejected") {
                title = `❌ ${empName}'s ${typeStr} Rejected`;
                message = `Leave request from ${item.start_date} to ${item.end_date} was Rejected`;
              }

              notifList.push({
                id: `leave_${item.id}_${item.status}`,
                title,
                message,
                time: item.created_at
                  ? new Date(item.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Today",
                type: "leave",
              });
            });
          }
        } else {
          // Employee: Fetch self leave applications & status updates
          const res = await api.get("/leaves/my").catch(() => null);
          if (res?.data?.data) {
            const myLeaves = res.data.data;
            myLeaves.slice(0, 10).forEach((item) => {
              const typeStr = item.leave_type
                ? item.leave_type.toUpperCase()
                : "LEAVE";

              let title = `⏳ Leave Application Pending`;
              let message = `Your ${typeStr} request (${item.start_date} to ${item.end_date}) is pending review`;

              if (item.status === "approved") {
                title = `🎉 Leave Request Approved!`;
                message = `Your ${typeStr} request (${item.start_date} to ${item.end_date}) was Approved by HR`;
              } else if (item.status === "rejected") {
                title = `❌ Leave Request Rejected`;
                message = `Your ${typeStr} request (${item.start_date} to ${item.end_date}) was Rejected`;
              }

              notifList.push({
                id: `myleave_${item.id}_${item.status}`,
                title,
                message,
                time: item.created_at
                  ? new Date(item.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Today",
                type: "leave",
              });
            });
          }
        }

        // Add System Online baseline item
        notifList.unshift({
          id: "sys_online_active",
          title: "🟢 System Synchronized",
          message: "HRMS Server active & connected to database",
          time: "Just now",
          type: "system",
        });

        if (isMounted) {
          setRawNotifs(notifList);
        }
      } catch (err) {
        console.error("Failed to fetch real-time notifications:", err);
      }
    };

    loadRealNotifications();
  }, [user?.role, userKey, location.pathname]);

  const notifications = rawNotifs.map((n) => ({
    ...n,
    unread: !readNotifIds.includes(n.id),
  }));

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = (e) => {
    if (e) e.stopPropagation();
    const allIds = notifications.map((n) => n.id);
    setReadNotifIds(allIds);
    try {
      localStorage.setItem(
        `hrms_read_notifs_${userKey}`,
        JSON.stringify(allIds)
      );
    } catch (err) {
      console.error(err);
    }
    notify.info("All notifications marked as read.");
  };

  const markAsRead = (id) => {
    if (readNotifIds.includes(id)) return;
    const updated = [...readNotifIds, id];
    setReadNotifIds(updated);
    try {
      localStorage.setItem(
        `hrms_read_notifs_${userKey}`,
        JSON.stringify(updated)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50/70 min-w-0 overflow-x-hidden">
      {/* Backdrop overlay ONLY for mobile drawer */}
      {mobileOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Invisible click-outside listener for Notification Dropdown (no dark overlay) */}
      {showNotifDropdown && (
        <div
          onClick={() => setShowNotifDropdown(false)}
          className="fixed inset-0 z-40 bg-transparent cursor-default"
          aria-hidden="true"
        />
      )}

      {/* Sidebar / Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800/80 shadow-2xl transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo & Close button for mobile */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <BuildingOffice2Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white font-heading">
                HRMS Portal
              </h1>
              <p className="text-[11px] text-indigo-400 font-medium tracking-wide uppercase">
                Enterprise Suite
              </p>
            </div>
          </div>
          <button
            onClick={closeMobileMenu}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            aria-label="Close Sidebar"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Management Section (Admin / HR) */}
          {(user?.role === "admin" || user?.role === "hr") && (
            <div>
              <p className="px-3.5 mb-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Management
              </p>
              <div className="space-y-1">
                <NavLink
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className={({ isActive }) => navItemClass(isActive)}
                >
                  {({ isActive }) => (
                    <>
                      {renderActiveIndicator(isActive)}
                      <HomeIcon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                      <span>Dashboard</span>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/employees"
                  onClick={closeMobileMenu}
                  className={({ isActive }) => navItemClass(isActive)}
                >
                  {({ isActive }) => (
                    <>
                      {renderActiveIndicator(isActive)}
                      <UserGroupIcon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                      <span>Employees</span>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/departments"
                  onClick={closeMobileMenu}
                  className={({ isActive }) => navItemClass(isActive)}
                >
                  {({ isActive }) => (
                    <>
                      {renderActiveIndicator(isActive)}
                      <BuildingOfficeIcon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                      <span>Departments</span>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/attendance"
                  onClick={closeMobileMenu}
                  className={({ isActive }) => navItemClass(isActive)}
                >
                  {({ isActive }) => (
                    <>
                      {renderActiveIndicator(isActive)}
                      <ClockIcon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                      <span>Attendance</span>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/leave"
                  onClick={closeMobileMenu}
                  className={({ isActive }) => navItemClass(isActive)}
                >
                  {({ isActive }) => (
                    <>
                      {renderActiveIndicator(isActive)}
                      <DocumentTextIcon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                      <span>Leave Requests</span>
                    </>
                  )}
                </NavLink>
              </div>
            </div>
          )}

          {/* Administration Section (Admin Only) */}
          {user?.role === "admin" && (
            <div>
              <p className="px-3.5 mb-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Administration
              </p>
              <div className="space-y-1">
                <NavLink
                  to="/users"
                  onClick={closeMobileMenu}
                  className={({ isActive }) => navItemClass(isActive)}
                >
                  {({ isActive }) => (
                    <>
                      {renderActiveIndicator(isActive)}
                      <UsersIcon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                      <span>User Control</span>
                    </>
                  )}
                </NavLink>
              </div>
            </div>
          )}

          {/* Self Service Section */}
          <div>
            <p className="px-3.5 mb-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Self Service
            </p>
            <div className="space-y-1">
              <NavLink
                to="/profile"
                onClick={closeMobileMenu}
                className={({ isActive }) => navItemClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    {renderActiveIndicator(isActive)}
                    <UserIcon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                    <span>My Profile</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/my-attendance"
                onClick={closeMobileMenu}
                className={({ isActive }) => navItemClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    {renderActiveIndicator(isActive)}
                    <MapPinIcon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                    <span>My Attendance</span>
                  </>
                )}
              </NavLink>

              <NavLink
                to="/my-leave"
                onClick={closeMobileMenu}
                className={({ isActive }) => navItemClass(isActive)}
              >
                {({ isActive }) => (
                  <>
                    {renderActiveIndicator(isActive)}
                    <ClipboardDocumentCheckIcon className={`w-5 h-5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                    <span>My Leave</span>
                  </>
                )}
              </NavLink>
            </div>
          </div>
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                {getUserInitials(user?.name)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {user?.name || "Employee"}
                </p>
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 uppercase tracking-wider">
                  {user?.role || "Employee"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 py-2.5 rounded-xl text-xs font-medium transition-all"
          >
            <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Glass Top Header */}
        <header className="sticky top-0 z-30 glass-header border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Hamburger button for mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-slate-600 hover:text-indigo-600 p-2 rounded-xl border border-slate-200 focus:outline-none bg-white"
              aria-label="Toggle Menu"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
                {getPageTitle()}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>HR Portal</span>
                <span>•</span>
                <span className="text-slate-600 font-medium">{currentDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Quick Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">System Online</span>
            </div>

            {/* Notification Bell Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className={`relative p-2 rounded-xl transition ${
                  showNotifDropdown
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
                }`}
                title="Notifications"
                aria-label="Notifications"
              >
                <BellIcon className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white" />
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 font-heading text-sm">
                        Notifications
                      </h3>
                      {unreadCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                          {unreadCount} new
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          ✓ All read
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAllAsRead(e);
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 cursor-pointer transition ${
                          n.unread ? "bg-indigo-50/30" : ""
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                            n.unread ? "bg-indigo-600" : "bg-slate-300"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              {n.title}
                            </p>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {n.time}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-[11px] text-slate-400">
                      Notifications synchronized with HRMS Server
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* User Chip */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
                {getUserInitials(user?.name)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {user?.name || "User"}
                </p>
                <p className="text-[10px] text-slate-500 capitalize">
                  {user?.role || "Employee"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;