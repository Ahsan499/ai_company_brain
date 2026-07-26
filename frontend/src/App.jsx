import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import OtpVerification from './pages/auth/OtpVerification'
import ResetPassword from './pages/auth/ResetPassword'
import PasswordUpdated from './pages/auth/PasswordUpdated'
import Dashboard from './pages/dashboard/Dashboard'
import Notifications from './pages/dashboard/Notifications'
import Organizations from './pages/dashboard/Organizations'
import OrganizationDetail from './pages/dashboard/OrganizationDetail'
import Users from './pages/dashboard/Users'
import UserDetail from './pages/dashboard/UserDetail'
import Departments from './pages/dashboard/Departments'
import DepartmentDetail from './pages/dashboard/DepartmentDetail'
import Projects from './pages/dashboard/Projects'
import ProjectDetail from './pages/dashboard/ProjectDetail'
import Tasks from './pages/dashboard/Tasks'

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthLayout variant="login">
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/auth/forgot-password"
          element={
            <AuthLayout variant="forgot">
              <ForgotPassword />
            </AuthLayout>
          }
        />
        <Route
          path="/auth/verify-otp"
          element={
            <AuthLayout variant="otp">
              <OtpVerification />
            </AuthLayout>
          }
        />
        <Route
          path="/auth/reset-password"
          element={
            <AuthLayout variant="reset">
              <ResetPassword />
            </AuthLayout>
          }
        />
        <Route
          path="/auth/password-updated"
          element={
            <AuthLayout variant="password-updated">
              <PasswordUpdated />
            </AuthLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/notifications"
          element={
            <DashboardLayout>
              <Notifications />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/organizations"
          element={
            <DashboardLayout>
              <Organizations />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/organizations/:id"
          element={
            <DashboardLayout>
              <OrganizationDetail />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/users"
          element={
            <DashboardLayout>
              <Users />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/users/:id"
          element={
            <DashboardLayout>
              <UserDetail />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/departments"
          element={
            <DashboardLayout>
              <Departments />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/departments/:id"
          element={
            <DashboardLayout>
              <DepartmentDetail />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/projects"
          element={
            <DashboardLayout>
              <Projects />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/projects/:id"
          element={
            <DashboardLayout>
              <ProjectDetail />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/tasks"
          element={
            <DashboardLayout>
              <Tasks />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/tasks/:id"
          element={
            <DashboardLayout>
              <Tasks />
            </DashboardLayout>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App
