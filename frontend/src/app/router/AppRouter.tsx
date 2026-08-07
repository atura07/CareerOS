import { Routes, Route, Navigate } from 'react-router-dom'
import {
  LandingPage,
  LoginPage,
  RegisterPage,
  PlacementDashboardPage,
  ResumePage,
CompanyPage,
CompanyDetailsPage,
LeetCodePage,
  GitHubPage,
ApplicationTrackerPage,
RoadmapPage,
  MockInterviewPage,
DSATrackerPage,
  ATSPage,
  AnalyticsPage,
} from '../../pages'
import { ProtectedRoute } from '../../components/auth'
import { DashboardLayout } from '../../layouts/DashboardLayout'

/**
 * Application router.
 *
 * Public routes:
 *   `/`                   → Landing page
 *   `/login`              → Login page
 *   `/register`           → Registration page
 *
 * Protected routes (require authentication):
 *   `/dashboard`           → Authenticated dashboard
 *   `/dashboard/resume`    → Resume upload page
 *   `/dashboard/companies` → Company placement dashboard
 *   `/dashboard/companies/:id` → Company details page
 *   `/dashboard/ats`       → ATS Score page (placeholder)
 *   `/dashboard/dsa`       → DSA Tracker page (placeholder)
 *   `/dashboard/interview` → Mock Interview page (placeholder)
 *   `/dashboard/roadmap`   → Roadmap page (placeholder)
 *   `/dashboard/applications` → Applications page (placeholder)
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
              <PlacementDashboardPage />
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
      <Route
        path="/dashboard/companies"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CompanyPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
<Route
        path="/dashboard/companies/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CompanyDetailsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
<Route
        path="/dashboard/leetcode"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <LeetCodePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/github"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <GitHubPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
<Route
        path="/dashboard/ats"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ATSPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
<Route
        path="/dashboard/dsa"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DSATrackerPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
<Route
path="/dashboard/interview"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <MockInterviewPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
<Route
        path="/dashboard/roadmap"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <RoadmapPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
<Route
        path="/dashboard/applications"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ApplicationTrackerPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/analytics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AnalyticsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
