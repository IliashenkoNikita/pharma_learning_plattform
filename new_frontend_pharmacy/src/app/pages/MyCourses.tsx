import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { GraduationCap, Clock, CheckCircle, PlayCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCourses, getMyEnrollments } from '../lib/api';
import { Course, EnrollmentStatus, UserCourseEnrollment } from '../types';

export function MyCourses() {
  const { token } = useAuth();
  const [myEnrollments, setMyEnrollments] = useState<UserCourseEnrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!token) return;

      try {
        const [enrollments, courseList] = await Promise.all([getMyEnrollments(token), getCourses(token)]);
        setMyEnrollments(enrollments);
        setCourses(courseList);
      } catch {
        setMyEnrollments([]);
      }
    };

    load();
  }, [token]);

  const inProgressCourses = useMemo(
    () => myEnrollments.filter((e) => e.status === EnrollmentStatus.InProgress),
    [myEnrollments]
  );
  const completedCourses = useMemo(
    () => myEnrollments.filter((e) => e.status === EnrollmentStatus.Completed),
    [myEnrollments]
  );
  const notStartedCourses = useMemo(
    () => myEnrollments.filter((e) => e.status === EnrollmentStatus.NotStarted),
    [myEnrollments]
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-bold text-3xl text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-2">Track your learning progress and continue your courses</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{inProgressCourses.length}</p>
          <p className="text-sm text-gray-600 mt-1">In Progress</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{completedCourses.length}</p>
          <p className="text-sm text-gray-600 mt-1">Completed</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{myEnrollments.length}</p>
          <p className="text-sm text-gray-600 mt-1">Total Enrolled</p>
        </div>
      </div>

      {/* In Progress Section */}
      {inProgressCourses.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-xl text-gray-900 mb-4">Continue Learning</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {inProgressCourses.map((enrollment) => {
              const course = courses.find((c) => c.id === enrollment.courseId);
              if (!course) return null;
              return (
                <div
                  key={enrollment.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-40 h-40 object-cover"
                    />
                    <div className="flex-1 p-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                        {course.category}
                      </span>
                      <h3 className="font-bold text-lg text-gray-900 mt-2 mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-gray-900">
                            {enrollment.progressPercent}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${enrollment.progressPercent}%` }}
                          ></div>
                        </div>
                        <Link
                          to={`/player/${course.id}`}
                          className="flex items-center justify-center gap-2 w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <PlayCircle className="w-4 h-4" />
                          Continue Course
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Not Started Section */}
      {notStartedCourses.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-xl text-gray-900 mb-4">Not Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notStartedCourses.map((enrollment) => {
              const course = courses.find((c) => c.id === enrollment.courseId);
              if (!course) return null;
              return (
                <div
                  key={enrollment.id}
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
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {course.category}
                    </span>
                    <h3 className="font-bold text-lg text-gray-900 mt-2 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    <Link
                      to={`/player/${course.id}`}
                      className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Start Course
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Section */}
      {completedCourses.length > 0 && (
        <div>
          <h2 className="font-bold text-xl text-gray-900 mb-4">Completed Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.map((enrollment) => {
              const course = courses.find((c) => c.id === enrollment.courseId);
              if (!course) return null;
              return (
                <div
                  key={enrollment.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover opacity-75"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="text-center text-white">
                        <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                        <p className="font-medium">Completed</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {course.category}
                    </span>
                    <h3 className="font-bold text-lg text-gray-900 mt-2 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-500">
                      Completed on {enrollment.completedAt ? new Date(enrollment.completedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {myEnrollments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">You haven't been enrolled in any courses yet</p>
          <Link
            to="/courses"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Available Courses
          </Link>
        </div>
      )}
    </div>
  );
}
