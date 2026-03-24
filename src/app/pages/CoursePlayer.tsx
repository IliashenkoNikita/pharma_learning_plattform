import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, CheckCircle, Circle, PlayCircle, FileText, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockCourses, mockLessons, mockLessonProgress } from '../data/mockData';

export function CoursePlayer() {
  const { courseId } = useParams<{ courseId: string }>();
  const { currentUser } = useAuth();
  const course = mockCourses.find((c) => c.id === courseId);
  const lessons = mockLessons
    .filter((l) => l.courseId === courseId)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0]?.id);
  const selectedLesson = lessons.find((l) => l.id === selectedLessonId);

  const userProgress = mockLessonProgress.filter((lp) => lp.userId === currentUser?.id);
  const isLessonCompleted = (lessonId: string) =>
    userProgress.some((lp) => lp.lessonId === lessonId && lp.isCompleted);

  const completedCount = lessons.filter((l) => isLessonCompleted(l.id)).length;
  const progressPercent = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  if (!course || !selectedLesson) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Course or lesson not found</p>
      </div>
    );
  }

  const handleMarkComplete = () => {
    console.log('Marking lesson as complete:', selectedLessonId);
    // In real app, this would call an API
  };

  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex((l) => l.id === selectedLessonId);
    if (currentIndex < lessons.length - 1) {
      setSelectedLessonId(lessons[currentIndex + 1].id);
    }
  };

  return (
    <div className="flex gap-6 -m-6 h-[calc(100vh-4rem)]">
      {/* Sidebar - Lesson List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link
            to={`/courses/${courseId}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course
          </Link>
          <h2 className="font-bold text-lg text-gray-900 mb-2">{course.title}</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">
                {completedCount} / {lessons.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {lessons.map((lesson, index) => {
              const completed = isLessonCompleted(lesson.id);
              const isActive = lesson.id === selectedLessonId;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-6 h-6 flex-shrink-0 mt-0.5">
                      {completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {index + 1}. {lesson.title}
                      </p>
                      <p className="text-xs text-gray-600">{lesson.estimatedDurationMinutes} min</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            {/* Video Player */}
            {selectedLesson.videoUrl && (
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <PlayCircle className="w-16 h-16 text-white mx-auto mb-3" />
                  <p className="text-white">Video Player</p>
                  <p className="text-gray-400 text-sm mt-1">Demo: {selectedLesson.videoUrl}</p>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            <div className="p-6">
              <h1 className="font-bold text-2xl text-gray-900 mb-4">{selectedLesson.title}</h1>
              <p className="text-gray-600 mb-6">{selectedLesson.description}</p>

              {selectedLesson.textContent && (
                <div className="prose max-w-none">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <h3 className="font-medium text-gray-900">Lesson Content</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{selectedLesson.textContent}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleMarkComplete}
              disabled={isLessonCompleted(selectedLessonId)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
                isLessonCompleted(selectedLessonId)
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              {isLessonCompleted(selectedLessonId) ? 'Completed' : 'Mark as Complete'}
            </button>

            {lessons.findIndex((l) => l.id === selectedLessonId) < lessons.length - 1 && (
              <button
                onClick={handleNextLesson}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Next Lesson
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {lessons.findIndex((l) => l.id === selectedLessonId) === lessons.length - 1 && (
              <Link
                to={`/quiz/${course.id}`}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Take Final Quiz
                <ChevronRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
