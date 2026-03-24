import { useEffect, useMemo, useState } from 'react';
import {
  Users,
  BookOpen,
  Building2,
  TrendingUp,
  GraduationCap,
  CheckCircle,
  Clock,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Course, EnrollmentStatus, User, UserCourseEnrollment, UserRole } from '../types';
import {
  getCompanies,
  getCompanyReport,
  getCourses,
  getMyEnrollments,
  getPlatformReport,
  getUsers,
} from '../lib/api';

export function Dashboard() {
  const { currentUser, token } = useAuth();

  if (!currentUser || !token) return null;

  if (currentUser.role === UserRole.Superadmin) {
    return <SuperadminDashboard token={token} />;
  }

  if (currentUser.role === UserRole.Manager) {
    return <ManagerDashboard user={currentUser} token={token} />;
  }

  return <EmployeeDashboard user={currentUser} token={token} />;
}

function SuperadminDashboard({ token }: { token: string }) {
  const [companies, setCompanies] = useState<Array<{ id: string; name: string; planName: string; subscriptionStatus: string }>>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [platform, companyList, courseList] = await Promise.all([
          getPlatformReport(token),
          getCompanies(token),
          getCourses(token),
        ]);

        setStats({
          totalCompanies: platform.totalCompanies,
          totalUsers: platform.totalUsers,
          totalCourses: platform.totalCourses,
          totalEnrollments: platform.totalEmployees,
        });
        setCompanies(companyList);
        setCourses(courseList);
      } catch {
        // Keep UI visible even if API fails.
      }
    };

    load();
  }, [token]);

  const cards = [
    { label: 'Active Companies', value: stats.totalCompanies, icon: Building2, className: 'bg-blue-100 text-blue-600' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, className: 'bg-green-100 text-green-600' },
    { label: 'Published Courses', value: stats.totalCourses, icon: BookOpen, className: 'bg-purple-100 text-purple-600' },
    { label: 'Total Employees', value: stats.totalEnrollments, icon: TrendingUp, className: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-bold text-3xl text-gray-900">Platform Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back, Admin! Here's what is happening across the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.className.split(' ')[0]}`}>
                  <Icon className={`w-6 h-6 ${stat.className.split(' ')[1]}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">Recent Companies</h2>
          <div className="space-y-3">
            {companies.slice(0, 5).map((company) => (
              <div key={company.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{company.name}</p>
                  <p className="text-sm text-gray-600">{company.planName} Plan</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  {company.subscriptionStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">Courses</h2>
          <div className="space-y-3">
            {courses.slice(0, 5).map((course) => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{course.title}</p>
                  <p className="text-sm text-gray-600">{course.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{course.estimatedDurationMinutes}m</p>
                  <p className="text-xs text-gray-600">duration</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ManagerDashboard({ user, token }: { user: User; token: string }) {
  const [employees, setEmployees] = useState<User[]>([]);
  const [summary, setSummary] = useState<{
    totalEmployees: number;
    seatLimit: number;
    completedEnrollments: number;
    averageProgress: number;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user.companyId) return;

      try {
        const [users, report] = await Promise.all([getUsers(token), getCompanyReport(user.companyId, token)]);
        const employeeUsers = users.filter((u) => u.role === UserRole.Employee && u.companyId === user.companyId);

        setEmployees(employeeUsers);
        setSummary({
          totalEmployees: report.summary.totalEmployees,
          seatLimit: report.summary.seatLimit,
          completedEnrollments: report.summary.completedEnrollments,
          averageProgress: report.summary.averageProgress,
        });
      } catch {
        // No-op fallback.
      }
    };

    load();
  }, [token, user.companyId]);

  const stats = [
    { label: 'Employees', value: summary?.totalEmployees ?? employees.length, icon: Users, className: 'bg-blue-100 text-blue-600' },
    { label: 'Seat Limit', value: summary?.seatLimit ?? 0, icon: Building2, className: 'bg-purple-100 text-purple-600' },
    { label: 'Avg. Progress', value: `${Math.round(summary?.averageProgress ?? 0)}%`, icon: Clock, className: 'bg-orange-100 text-orange-600' },
    { label: 'Completed', value: summary?.completedEnrollments ?? 0, icon: CheckCircle, className: 'bg-green-100 text-green-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-bold text-3xl text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your team training progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.className.split(' ')[0]}`}>
                  <Icon className={`w-6 h-6 ${stat.className.split(' ')[1]}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-4">Team Members</h2>
        <div className="space-y-3">
          {employees.slice(0, 8).map((employee) => (
            <div key={employee.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900">
                  {employee.firstName} {employee.lastName}
                </p>
                <p className="text-sm text-gray-600">{employee.email}</p>
              </div>
            </div>
          ))}
          {employees.length === 0 && <p className="text-gray-500">No employees found.</p>}
        </div>
      </div>
    </div>
  );
}

function EmployeeDashboard({ user, token }: { user: User; token: string }) {
  const [enrollments, setEnrollments] = useState<UserCourseEnrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [myEnrollments, allCourses] = await Promise.all([getMyEnrollments(token), getCourses(token)]);
        setEnrollments(myEnrollments);
        setCourses(allCourses);
      } catch {
        // Keep dashboard visible.
      }
    };

    load();
  }, [token]);

  const completedCourses = useMemo(
    () => enrollments.filter((e) => e.status === EnrollmentStatus.Completed).length,
    [enrollments]
  );
  const inProgressCourses = useMemo(
    () => enrollments.filter((e) => e.status === EnrollmentStatus.InProgress).length,
    [enrollments]
  );

  const stats = [
    { label: 'Enrolled Courses', value: enrollments.length, icon: GraduationCap, className: 'bg-blue-100 text-blue-600' },
    { label: 'In Progress', value: inProgressCourses, icon: Clock, className: 'bg-orange-100 text-orange-600' },
    { label: 'Completed', value: completedCourses, icon: CheckCircle, className: 'bg-green-100 text-green-600' },
    { label: 'Quizzes Passed', value: completedCourses, icon: Award, className: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-bold text-3xl text-gray-900">Welcome back, {user.firstName}!</h1>
        <p className="text-gray-600 mt-2">Continue your learning journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.className.split(' ')[0]}`}>
                  <Icon className={`w-6 h-6 ${stat.className.split(' ')[1]}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-4">Continue Learning</h2>
        <div className="space-y-4">
          {enrollments
            .filter((e) => e.status === EnrollmentStatus.InProgress)
            .map((enrollment) => {
              const course = courses.find((c) => c.id === enrollment.courseId);
              if (!course) return null;

              return (
                <div key={enrollment.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img src={course.thumbnailUrl} alt={course.title} className="w-24 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{course.title}</p>
                    <p className="text-sm text-gray-600">{course.category}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${enrollment.progressPercent}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-600">{enrollment.progressPercent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
