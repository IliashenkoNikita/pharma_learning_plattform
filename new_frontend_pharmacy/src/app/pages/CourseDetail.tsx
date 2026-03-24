import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Clock, BookOpen, Edit, PlayCircle, FileText, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCourseById, getLessonsByCourse } from '../lib/api';
import { Course, Lesson, UserRole } from '../types';

export function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentUser, token } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!id || !token) return;

      try {
        const [courseData, lessonsData] = await Promise.all([
          getCourseById(id, token),
          getLessonsByCourse(id, token),
        ]);
        setCourse(courseData);
        setLessons(lessonsData.sort((a, b) => a.orderIndex - b.orderIndex));
      } catch {
        setCourse(null);
      }
    };

    load();
  }, [id, token]);

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Course not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link to="/courses" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>
        {currentUser?.role === UserRole.Superadmin && (
          <Link
            to={`/courses/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="w-5 h-5" />
            Edit Course
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="aspect-video w-full overflow-hidden bg-gray-100">
          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {course.category}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                course.status === 'Published'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {course.status}
            </span>
          </div>
          <h1 className="font-bold text-3xl text-gray-900 mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{course.estimatedDurationMinutes} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>{lessons.length} lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>Final Quiz</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-xl text-gray-900">Course Content</h2>
              {currentUser?.role === UserRole.Superadmin && (
                <Link
                  to={`/courses/${id}/lessons/new`}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  + Add Lesson
                </Link>
              )}
            </div>
            <div className="space-y-2">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-700 font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{lesson.title}</p>
                    <p className="text-sm text-gray-600">{lesson.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {lesson.videoUrl && <PlayCircle className="w-5 h-5" />}
                    {lesson.textContent && <FileText className="w-5 h-5" />}
                    <span className="whitespace-nowrap">{lesson.estimatedDurationMinutes} min</span>
                  </div>
                </div>
              ))}
              {lessons.length === 0 && (
                <p className="text-gray-500 text-center py-8">No lessons yet</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Final Assessment</h3>
                <p className="text-sm text-gray-600">Available after lessons are complete</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Complete all lessons to unlock the final assessment and earn your certificate.
            </p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Take Quiz
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Course Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Course ID</p>
                <p className="font-medium text-gray-900">{course.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Created</p>
                <p className="font-medium text-gray-900">
                  {new Date(course.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {new Date(course.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Duration</p>
                <p className="font-medium text-gray-900">
                  {course.estimatedDurationMinutes} minutes
                </p>
              </div>
            </div>
          </div>

          {currentUser?.role === UserRole.Employee && (
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-3">Ready to start?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Begin your learning journey with this course.
              </p>
              <Link
                to={`/player/${course.id}`}
                className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Start Course
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
