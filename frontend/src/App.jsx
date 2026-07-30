import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
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
import Teams from './pages/dashboard/Teams'
import TeamDetail from './pages/dashboard/TeamDetail'
import Meetings from './pages/dashboard/Meetings'
import TimeTracking from './pages/dashboard/TimeTracking'
import TimeTrackingReports from './pages/dashboard/TimeTrackingReports'
import Files from './pages/dashboard/Files'
import Knowledge from './pages/dashboard/Knowledge'
import Reports from './pages/dashboard/Reports'
import AuditLogs from './pages/dashboard/AuditLogs'
import Settings from './pages/dashboard/Settings'
import Profile from './pages/dashboard/Profile'
import AccountSettings from './components/settings/sections/AccountSettings'
import OrganizationSettings from './components/settings/sections/OrganizationSettings'
import SecuritySettings from './components/settings/sections/SecuritySettings'
import NotificationSettings from './components/settings/sections/NotificationSettings'
import RolesPermissions from './components/settings/sections/RolesPermissions'
import BillingSettings from './components/settings/sections/BillingSettings'

function App() {
  return (
    <Router>
      <AuthProvider>
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

          <Route element={<ProtectedRoute />}>
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
            <Route
              path="/dashboard/teams"
              element={
                <DashboardLayout>
                  <Teams />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/teams/:id"
              element={
                <DashboardLayout>
                  <TeamDetail />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/meetings"
              element={
                <DashboardLayout>
                  <Meetings />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/meetings/:id"
              element={
                <DashboardLayout>
                  <Meetings />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/time-tracking"
              element={
                <DashboardLayout>
                  <TimeTracking />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/time-tracking/reports"
              element={
                <DashboardLayout>
                  <TimeTrackingReports />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/files"
              element={
                <DashboardLayout>
                  <Files />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/files/:id"
              element={
                <DashboardLayout>
                  <Files />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/knowledge"
              element={
                <DashboardLayout>
                  <Knowledge />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/reports"
              element={
                <DashboardLayout>
                  <Reports />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/audit-logs"
              element={
                <DashboardLayout>
                  <AuditLogs />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              }
            >
              <Route index element={<Navigate to="account" replace />} />
              <Route path="account" element={<AccountSettings />} />
              <Route path="organization" element={<OrganizationSettings />} />
              <Route path="security" element={<SecuritySettings />} />
              <Route path="notifications" element={<NotificationSettings />} />
              <Route path="roles-permissions" element={<RolesPermissions />} />
              <Route path="billing" element={<BillingSettings />} />
            </Route>
            <Route
              path="/dashboard/profile"
              element={
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              }
            />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
