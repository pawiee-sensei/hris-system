import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import AppLayout from './components/AppLayout'
import Dashboard from './pages/shared/Dashboard'

// Employee pages
import MyProfile from './pages/employee/MyProfile'
import MyAttendance from './pages/employee/MyAttendance'
import MyLeave from './pages/employee/MyLeave'
import MyLeaveBalance from './pages/employee/MyLeaveBalance'
import Announcements from './pages/shared/Announcements'
import ChangePassword from './pages/shared/ChangePassword'
// Admin pages
import RoleRoute from './routes/RoleRoute'
import EmployeeList from './pages/admin/EmployeeList'
import DepartmentList from './pages/admin/DepartmentList'
import LeaveApprovals from './pages/admin/LeaveApprovals'
import LeaveBalanceGrant from './pages/admin/LeaveBalanceGrant'
import AnnouncementCreate from './pages/admin/AnnouncementCreate'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout><MyProfile /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <AppLayout><MyAttendance /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/leave"
        element={
          <ProtectedRoute>
            <AppLayout><MyLeave /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/leave-balance"
        element={
          <ProtectedRoute>
            <AppLayout><MyLeaveBalance /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/announcements"
        element={
          <ProtectedRoute>
            <AppLayout><Announcements /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <AppLayout><ChangePassword /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/employees"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["ADMIN", "HR"]}>
              <AppLayout><EmployeeList /></AppLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/departments"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["ADMIN", "HR"]}>
              <AppLayout><DepartmentList /></AppLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/leave-approvals"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["ADMIN", "HR"]}>
              <AppLayout><LeaveApprovals /></AppLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/leave-balance-grant"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["ADMIN", "HR"]}>
              <AppLayout><LeaveBalanceGrant /></AppLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/announcements/create"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["ADMIN", "HR"]}>
              <AppLayout><AnnouncementCreate /></AppLayout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App