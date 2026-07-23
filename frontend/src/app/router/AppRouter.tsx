import { Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage, LoginPage, RegisterPage, DashboardPage, ResumePage } from '../../pages'
import { ProtectedRoute } from '../../components/auth'
import { DashboardLayout } from '../../layouts/DashboardLayout'

/**
 * Application router.
 *
 * Public routes:
 *   `/`              → Landing page
 *   `/login`         → Login page
 *   `/register`      → Registration page
 *
 * Protected routes (require authentication):
 *   `/dashboard`      → Authenticated dashboard
 *   `/dashboard/resume` → Resume upload page
 *   `/dashboard/*`    → Future sub-pages (ats, dsa, interview, etc.)
 */
export function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/resume"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ResumePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

