import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Building2, Users, Calendar, CreditCard, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Company, Course, User } from '../types';
import { assignCourseToCompany, getCompanies, getCompanyById, getCourses, getUsers } from '../lib/api';

export function CompanyDetail() {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [companyUsers, setCompanyUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseToAssign, setCourseToAssign] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!id || !token) return;

      try {
        const [companyData, usersData, coursesData] = await Promise.all([
          getCompanyById(id, token),
          getUsers(token),
          getCourses(token),
        ]);
        setCompany(companyData);
        setCompanyUsers(usersData.filter((u) => u.companyId === id));
        setCourses(coursesData);
      } catch {
        setCompany(null);
      }
    };

    load();
  }, [id, token]);

  const assignedCourses = courses;

  if (!company) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Company not found</p>
      </div>
    );
  }

  return (
    <div>
      <Link to="/companies" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Companies
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="font-bold text-3xl text-gray-900">{company.name}</h1>
            <p className="text-gray-600 mt-1">Company ID: {company.id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Plan</p>
          </div>
          <p className="font-bold text-2xl text-gray-900">{company.planName}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Seats</p>
          </div>
          <p className="font-bold text-2xl text-gray-900">
            {companyUsers.length} / {company.seatLimit}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Active Until</p>
          </div>
          <p className="font-bold text-lg text-gray-900">
            {new Date(company.activeUntil).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-900">Users ({companyUsers.length})</h2>
            <Link to="/users" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Manage Users
            </Link>
          </div>
          <div className="space-y-3">
            {companyUsers.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {user.role}
                </span>
              </div>
            ))}
            {companyUsers.length === 0 && (
              <p className="text-gray-500 text-center py-4">No users yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-gray-900">Assigned Courses ({assignedCourses.length})</h2>
            <div className="flex items-center gap-2">
              <select
                value={courseToAssign}
                onChange={(e) => setCourseToAssign(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 rounded"
              >
                <option value="">Select course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              <button
                onClick={async () => {
                  if (!id || !token || !courseToAssign) return;
                  try {
                    await assignCourseToCompany(courseToAssign, id, token);
                  } catch {
                    // keep view stable
                  }
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Assign
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {assignedCourses.map((course) => (
              <div key={course.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{course.title}</p>
                  <p className="text-sm text-gray-600">{course.category}</p>
                </div>
              </div>
            ))}
            {assignedCourses.length === 0 && (
              <p className="text-gray-500 text-center py-4">No courses assigned yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-4">Subscription Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                company.subscriptionStatus === 'Active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {company.subscriptionStatus}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Created</p>
            <p className="font-medium text-gray-900">
              {new Date(company.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Last Updated</p>
            <p className="font-medium text-gray-900">
              {new Date(company.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Seat Utilization</p>
            <p className="font-medium text-gray-900">
              {Math.round((companyUsers.length / company.seatLimit) * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
