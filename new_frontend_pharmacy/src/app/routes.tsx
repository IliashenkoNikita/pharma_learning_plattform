import { createBrowserRouter, Navigate } from 'react-router';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Companies } from './pages/Companies';
import { CompanyDetail } from './pages/CompanyDetail';
import { Users } from './pages/Users';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { CourseForm } from './pages/CourseForm';
import { CoursePlayer } from './pages/CoursePlayer';
import { Quiz } from './pages/Quiz';
import { MyCourses } from './pages/MyCourses';
import { Reports } from './pages/Reports';
import { Subscription } from './pages/Subscription';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserRole } from './types';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'companies',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.Superadmin]}>
            <Companies />
          </ProtectedRoute>
        ),
      },
      {
        path: 'companies/:id',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.Superadmin]}>
            <CompanyDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.Superadmin, UserRole.Manager]}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: 'courses',
        element: <Courses />,
      },
      {
        path: 'courses/new',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.Superadmin]}>
            <CourseForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'courses/:id',
        element: <CourseDetail />,
      },
      {
        path: 'courses/:id/edit',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.Superadmin]}>
            <CourseForm />
          </ProtectedRoute>
        ),
      },
      {
        path: 'player/:courseId',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.Employee]}>
            <CoursePlayer />
          </ProtectedRoute>
        ),
      },
      {
        path: 'quiz/:courseId',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.Employee]}>
            <Quiz />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-courses',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.Employee]}>
            <MyCourses />
          </ProtectedRoute>
        ),
      },
      {
        path: 'reports',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.Superadmin, UserRole.Manager]}>
            <Reports />
          </ProtectedRoute>
        ),
      },
      {
        path: 'subscription',
        element: (
          <ProtectedRoute allowedRoles={[UserRole.Manager]}>
            <Subscription />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
