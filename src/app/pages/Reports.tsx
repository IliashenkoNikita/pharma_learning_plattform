import { useState } from 'react';
import { Download, BarChart3, TrendingUp, Users, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  mockUsers, 
  mockEnrollments, 
  mockCourses, 
  mockQuizAttempts,
  mockCompanies 
} from '../data/mockData';
import { UserRole, EnrollmentStatus } from '../types';

export function Reports() {
  const { currentUser } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Filter data based on user role
  let relevantUsers = mockUsers;
  let relevantEnrollments = mockEnrollments;
  
  if (currentUser?.role === UserRole.Manager && currentUser.companyId) {
    relevantUsers = mockUsers.filter((u) => u.companyId === currentUser.companyId);
    const userIds = relevantUsers.map((u) => u.id);
    relevantEnrollments = mockEnrollments.filter((e) => userIds.includes(e.userId));
  }

  // Calculate metrics
  const totalEnrollments = relevantEnrollments.length;
  const completedEnrollments = relevantEnrollments.filter(
    (e) => e.status === EnrollmentStatus.Completed
  ).length;
  const inProgressEnrollments = relevantEnrollments.filter(
    (e) => e.status === EnrollmentStatus.InProgress
  ).length;
  const avgProgress =
    relevantEnrollments.length > 0
      ? relevantEnrollments.reduce((sum, e) => sum + e.progressPercent, 0) /
        relevantEnrollments.length
      : 0;

  const handleExportCSV = () => {
    console.log('Exporting CSV report...');
    // In real app, this would generate and download a CSV file
    alert('CSV report exported successfully!');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-bold text-3xl text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">
          {currentUser?.role === UserRole.Superadmin
            ? 'Platform-wide training metrics and insights'
            : 'Track your team\'s training progress and performance'}
        </p>
      </div>

      {/* Period Selector and Export */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedPeriod === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedPeriod === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedPeriod === 'year'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Year
          </button>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalEnrollments}</p>
          <p className="text-sm text-gray-600 mt-1">Total Enrollments</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{completedEnrollments}</p>
          <p className="text-sm text-gray-600 mt-1">Completed Courses</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{inProgressEnrollments}</p>
          <p className="text-sm text-gray-600 mt-1">In Progress</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{Math.round(avgProgress)}%</p>
          <p className="text-sm text-gray-600 mt-1">Avg. Progress</p>
        </div>
      </div>

      {/* Employee Progress Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900">Employee Progress</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrolled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Progress
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {relevantUsers
                .filter((u) => u.role === UserRole.Employee)
                .map((user) => {
                  const userEnrollments = relevantEnrollments.filter((e) => e.userId === user.id);
                  const completed = userEnrollments.filter(
                    (e) => e.status === EnrollmentStatus.Completed
                  ).length;
                  const inProgress = userEnrollments.filter(
                    (e) => e.status === EnrollmentStatus.InProgress
                  ).length;
                  const avgUserProgress =
                    userEnrollments.length > 0
                      ? userEnrollments.reduce((sum, e) => sum + e.progressPercent, 0) /
                        userEnrollments.length
                      : 0;

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{userEnrollments.length}</td>
                      <td className="px-6 py-4 text-gray-900">{inProgress}</td>
                      <td className="px-6 py-4 text-gray-900">{completed}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[120px] bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${avgUserProgress}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-900 w-12">{Math.round(avgUserProgress)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900">Course Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockCourses.map((course) => {
                const courseEnrollments = relevantEnrollments.filter(
                  (e) => e.courseId === course.id
                );
                const courseCompleted = courseEnrollments.filter(
                  (e) => e.status === EnrollmentStatus.Completed
                ).length;
                const completionRate =
                  courseEnrollments.length > 0
                    ? Math.round((courseCompleted / courseEnrollments.length) * 100)
                    : 0;

                const courseQuizAttempts = mockQuizAttempts.filter((qa) => {
                  const quiz = mockQuizzes.find((q) => q.id === qa.quizId);
                  return quiz?.courseId === course.id;
                });
                const avgScore =
                  courseQuizAttempts.length > 0
                    ? Math.round(
                        courseQuizAttempts.reduce((sum, qa) => sum + qa.scorePercent, 0) /
                          courseQuizAttempts.length
                      )
                    : 0;

                return (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{course.title}</p>
                      <p className="text-sm text-gray-500">{course.category}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{courseEnrollments.length}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[100px] bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-900 w-10">{completionRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">
                        {courseQuizAttempts.length > 0 ? `${avgScore}%` : 'N/A'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const mockQuizzes = [
  { id: 'quiz-1', courseId: 'course-1', title: 'Regulations Quiz', passingScorePercent: 80 },
  { id: 'quiz-2', courseId: 'course-2', title: 'Clinical Trials Quiz', passingScorePercent: 75 },
];
