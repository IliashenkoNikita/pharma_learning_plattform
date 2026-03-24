import { Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  BookOpen, 
  FileText, 
  BarChart3, 
  LogOut,
  GraduationCap,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export function Sidebar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  if (!currentUser) return null;

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navLinkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive(path)
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="font-bold text-xl text-blue-700">Pharma Training</h1>
        <p className="text-sm text-gray-600 mt-1">{currentUser.role}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <Link to="/dashboard" className={navLinkClass('/dashboard')}>
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        {currentUser.role === UserRole.Superadmin && (
          <>
            <Link to="/companies" className={navLinkClass('/companies')}>
              <Building2 className="w-5 h-5" />
              <span>Companies</span>
            </Link>
            <Link to="/users" className={navLinkClass('/users')}>
              <Users className="w-5 h-5" />
              <span>Users</span>
            </Link>
            <Link to="/courses" className={navLinkClass('/courses')}>
              <BookOpen className="w-5 h-5" />
              <span>Courses</span>
            </Link>
            <Link to="/reports" className={navLinkClass('/reports')}>
              <BarChart3 className="w-5 h-5" />
              <span>Reports</span>
            </Link>
          </>
        )}

        {currentUser.role === UserRole.Manager && (
          <>
            <Link to="/users" className={navLinkClass('/users')}>
              <Users className="w-5 h-5" />
              <span>Employees</span>
            </Link>
            <Link to="/courses" className={navLinkClass('/courses')}>
              <BookOpen className="w-5 h-5" />
              <span>Courses</span>
            </Link>
            <Link to="/reports" className={navLinkClass('/reports')}>
              <BarChart3 className="w-5 h-5" />
              <span>Reports</span>
            </Link>
            <Link to="/subscription" className={navLinkClass('/subscription')}>
              <CreditCard className="w-5 h-5" />
              <span>Subscription</span>
            </Link>
          </>
        )}

        {currentUser.role === UserRole.Employee && (
          <>
            <Link to="/my-courses" className={navLinkClass('/my-courses')}>
              <GraduationCap className="w-5 h-5" />
              <span>My Courses</span>
            </Link>
            <Link to="/courses" className={navLinkClass('/courses')}>
              <BookOpen className="w-5 h-5" />
              <span>All Courses</span>
            </Link>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-3 px-4">
          <p className="text-sm font-medium text-gray-900">
            {currentUser.firstName} {currentUser.lastName}
          </p>
          <p className="text-xs text-gray-500">{currentUser.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
