import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  Users, 
  BookOpen, 
  Building2, 
  TrendingUp, 
  GraduationCap, 
  CheckCircle, 
  Clock,
  Award
} from 'lucide-react';
import { 
  mockCompanies, 
  mockUsers, 
  mockCourses, 
  mockEnrollments,
  mockLessonProgress,
  mockQuizAttempts
} from '../data/mockData';

export function Dashboard() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  if (currentUser.role === UserRole.Superadmin) {
    return <SuperadminDashboard />;
  } else if (currentUser.role === UserRole.Manager) {
    return <ManagerDashboard user={currentUser} />;
  } else {
    return <EmployeeDashboard user={currentUser} />;
  }
}

function SuperadminDashboard() {
  const activeCompanies = mockCompanies.filter((c) => c.subscriptionStatus === 'Active').length;
  const totalUsers = mockUsers.length;
  const totalCourses = mockCourses.filter((c) => c.status === 'Published').length;
  const totalEnrollments = mockEnrollments.length;

  const stats = [
    { label: 'Active Companies', value: activeCompanies, icon: Building2, color: 'blue' },
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'green' },
    { label: 'Published Courses', value: totalCourses, icon: BookOpen, color: 'purple' },
    { label: 'Total Enrollments', value: totalEnrollments, icon: TrendingUp, color: 'orange' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-bold text-3xl text-gray-900">Platform Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back, Admin! Here's what's happening across the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
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
            {mockCompanies.slice(0, 5).map((company) => (
              <div key={company.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{company.name}</p>
                  <p className="text-sm text-gray-600">{company.planName} Plan</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    company.subscriptionStatus === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {company.subscriptionStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">Popular Courses</h2>
          <div className="space-y-3">
            {mockCourses.slice(0, 5).map((course) => {
              const enrollments = mockEnrollments.filter((e) => e.courseId === course.id).length;
              return (
                <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{course.title}</p>
                    <p className="text-sm text-gray-600">{course.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{enrollments}</p>
                    <p className="text-xs text-gray-600">enrollments</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ManagerDashboard({ user }: { user: any }) {
  const companyUsers = mockUsers.filter((u) => u.companyId === user.companyId);
  const employees = companyUsers.filter((u) => u.role === UserRole.Employee);
  const company = mockCompanies.find((c) => c.id === user.companyId);
  
  const employeeEnrollments = mockEnrollments.filter((e) => 
    employees.some((emp) => emp.id === e.userId)
  );
  
  const completedCourses = employeeEnrollments.filter((e) => e.status === 'Completed').length;
  const inProgressCourses = employeeEnrollments.filter((e) => e.status === 'InProgress').length;

  const stats = [
    { label: 'Employees', value: employees.length, icon: Users, color: 'blue' },
    { label: 'Seat Limit', value: company?.seatLimit || 0, icon: Building2, color: 'purple' },
    { label: 'Courses in Progress', value: inProgressCourses, icon: Clock, color: 'orange' },
    { label: 'Courses Completed', value: completedCourses, icon: CheckCircle, color: 'green' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-bold text-3xl text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your team's training progress at {company?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
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
          <h2 className="font-bold text-lg text-gray-900 mb-4">Employee Progress</h2>
          <div className="space-y-3">
            {employees.slice(0, 5).map((employee) => {
              const enrollments = mockEnrollments.filter((e) => e.userId === employee.id);
              const avgProgress =
                enrollments.length > 0
                  ? enrollments.reduce((sum, e) => sum + e.progressPercent, 0) / enrollments.length
                  : 0;
              return (
                <div key={employee.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{Math.round(avgProgress)}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${avgProgress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">Subscription Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Current Plan</p>
                <p className="font-bold text-xl text-gray-900">{company?.planName}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Seats Used</p>
                <p className="font-bold text-xl text-gray-900">
                  {employees.length} / {company?.seatLimit}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Active Until</p>
                <p className="font-bold text-xl text-gray-900">
                  {company?.activeUntil ? new Date(company.activeUntil).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmployeeDashboard({ user }: { user: any }) {
  const myEnrollments = mockEnrollments.filter((e) => e.userId === user.id);
  const completedCourses = myEnrollments.filter((e) => e.status === 'Completed').length;
  const inProgressCourses = myEnrollments.filter((e) => e.status === 'InProgress').length;
  const myLessonProgress = mockLessonProgress.filter((lp) => lp.userId === user.id);
  const myQuizAttempts = mockQuizAttempts.filter((qa) => qa.userId === user.id);
  const passedQuizzes = myQuizAttempts.filter((qa) => qa.passed).length;

  const stats = [
    { label: 'Enrolled Courses', value: myEnrollments.length, icon: GraduationCap, color: 'blue' },
    { label: 'In Progress', value: inProgressCourses, icon: Clock, color: 'orange' },
    { label: 'Completed', value: completedCourses, icon: CheckCircle, color: 'green' },
    { label: 'Quizzes Passed', value: passedQuizzes, icon: Award, color: 'purple' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-bold text-3xl text-gray-900">
          Welcome back, {user.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">Continue your learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
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
          {myEnrollments
            .filter((e) => e.status === 'InProgress')
            .map((enrollment) => {
              const course = mockCourses.find((c) => c.id === enrollment.courseId);
              if (!course) return null;
              return (
                <div key={enrollment.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-24 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{course.title}</p>
                    <p className="text-sm text-gray-600">{course.category}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${enrollment.progressPercent}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{enrollment.progressPercent}%</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Continue
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
