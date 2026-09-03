import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AccessibilityBar } from './components/AccessibilityBar';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { CaregiverDashboard } from './pages/CaregiverDashboard';
import { MemoriesPage } from './pages/MemoriesPage';
import { PeoplePage } from './pages/PeoplePage';
import { GamesPage } from './pages/GamesPage';
import { CaregiverPeopleMet } from './pages/CaregiverPeopleMet';
import { CaregiverMedsPage } from './pages/CaregiverMedsPage';

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AccessibilityProvider>
            <div className="min-h-screen flex flex-col">
              <AccessibilityBar />
              <Navbar />
              
              <div className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />

                  {/* Patient Routes */}
                  <Route
                    path="/patient"
                    element={
                      <ProtectedRoute requiredRole="patient">
                        <PatientDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/patient/memories"
                    element={
                      <ProtectedRoute requiredRole="patient">
                        <MemoriesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/patient/people"
                    element={
                      <ProtectedRoute requiredRole="patient">
                        <PeoplePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/patient/games"
                    element={
                      <ProtectedRoute requiredRole="patient">
                        <GamesPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Caregiver Routes */}
                  <Route
                    path="/caregiver"
                    element={
                      <ProtectedRoute requiredRole="caregiver">
                        <CaregiverDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/caregiver/people-met"
                    element={
                      <ProtectedRoute requiredRole="caregiver">
                        <CaregiverPeopleMet />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/caregiver/medications"
                    element={
                      <ProtectedRoute requiredRole="caregiver">
                        <CaregiverMedsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all fallback route */}
                  <Route path="*" element={<Navigate to="/patient" replace />} />
                </Routes>
              </div>
            </div>
          </AccessibilityProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

