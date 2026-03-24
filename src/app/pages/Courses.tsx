import { useState } from 'react';
import { Link } from 'react-router';
import { Plus, Search, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockCourses, mockCompanyCourseAssignments } from '../data/mockData';
import { UserRole, CourseStatus } from '../types';

export function Courses() {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter courses based on user role
  let coursesToDisplay = mockCourses;
  if (currentUser?.role === UserRole.Manager && currentUser.companyId) {
    const assignedCourseIds = mockCompanyCourseAssignments
      .filter((a) => a.companyId === currentUser.companyId)
      .map((a) => a.courseId);
    coursesToDisplay = mockCourses.filter((c) => assignedCourseIds.includes(c.id));
  }

  const filteredCourses = coursesToDisplay.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-bold text-3xl text-gray-900">Courses</h1>
        <p className="text-gray-600 mt-2">
          {currentUser?.role === UserRole.Superadmin
            ? 'Manage training courses and content'
            : 'Available courses for your organization'}
        </p>
      </div>

      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value={CourseStatus.Published}>Published</option>
            <option value={CourseStatus.Draft}>Draft</option>
          </select>
        </div>
        {currentUser?.role === UserRole.Superadmin && (
          <Link
            to="/courses/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Create Course
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-video w-full overflow-hidden bg-gray-100">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                  {course.category}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    course.status === CourseStatus.Published
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {course.status}
                </span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.estimatedDurationMinutes} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>View Details</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No courses found</p>
        </div>
      )}
    </div>
  );
}
