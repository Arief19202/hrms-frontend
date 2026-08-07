import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Auth/Login";

import Dashboard from "../pages/Dashboard/Dashboard";
import Employee from "../pages/Employee/Employee";
import Department from "../pages/Department/Department";
import Attendance from "../pages/Attendance/Attendance";
import Leave from "../pages/leaves/Leaves";

// ===== New Pages =====
import Users from "../pages/Users/Users";
import Profile from "../pages/Profile/Profile";
import MyAttendance from "../pages/MyAttendance/MyAttendance";
import MyLeave from "../pages/MyLeave/MyLeave";

import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Protected */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Master Data */}
          <Route path="/employees" element={<Employee />} />
          <Route path="/departments" element={<Department />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leave" element={<Leave />} />

          {/* User Management */}
          <Route path="/users" element={<Users />} />

          {/* Employee Self Service */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-attendance" element={<MyAttendance />} />
          <Route path="/my-leave" element={<MyLeave />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;