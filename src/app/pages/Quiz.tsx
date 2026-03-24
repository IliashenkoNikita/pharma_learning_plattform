import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, Award, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { mockQuizzes, mockQuizQuestions, mockCourses } from '../data/mockData';

export function Quiz() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const quiz = mockQuizzes.find((q) => q.courseId === courseId);
  const course = mockCourses.find((c) => c.id === courseId);
  const questions = quiz ? mockQuizQuestions.filter((q) => q.quizId === quiz.id) : [];

  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!quiz || !course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Quiz not found</p>
      </div>
    );
  }

  const handleAnswerChange = (questionId: string, optionId: string, isMultiple: boolean) => {
    if (isMultiple) {
      const currentAnswers = answers[questionId] || [];
      if (currentAnswers.includes(optionId)) {
        setAnswers({
          ...answers,
          [questionId]: currentAnswers.filter((id) => id !== optionId),
        });
      } else {
        setAnswers({
          ...answers,
          [questionId]: [...currentAnswers, optionId],
        });
      }
    } else {
      setAnswers({
        ...answers,
        [questionId]: [optionId],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let correctCount = 0;
    questions.forEach((question) => {
      const userAnswers = answers[question.id] || [];
      const correctOptions = question.options.filter((opt) => opt.isCorrect);
      const correctOptionIds = correctOptions.map((opt) => opt.id);

      // Check if user's answers match correct answers exactly
      const isCorrect =
        userAnswers.length === correctOptionIds.length &&
        userAnswers.every((id) => correctOptionIds.includes(id));

      if (isCorrect) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);
  };

  const passed = score >= quiz.passingScorePercent;

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div
            className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {passed ? (
              <Award className="w-10 h-10 text-green-600" />
            ) : (
              <AlertCircle className="w-10 h-10 text-red-600" />
            )}
          </div>

          <h1 className="font-bold text-3xl text-gray-900 mb-2">
            {passed ? 'Congratulations!' : 'Not Quite There'}
          </h1>
          <p className="text-gray-600 mb-6">
            {passed
              ? `You've passed the quiz with a score of ${score}%`
              : `You scored ${score}%. You need ${quiz.passingScorePercent}% to pass.`}
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{score}%</p>
                <p className="text-sm text-gray-600">Your Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{quiz.passingScorePercent}%</p>
                <p className="text-sm text-gray-600">Passing Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((score / 100) * questions.length)} / {questions.length}
                </p>
                <p className="text-sm text-gray-600">Correct Answers</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            {!passed && (
              <button
                onClick={() => {
                  setSubmitted(false);
                  setAnswers({});
                  setScore(0);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Try Again
              </button>
            )}
            <Link
              to={`/courses/${courseId}`}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Back to Course
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to={`/player/${courseId}`}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Course
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
            <Award className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="font-bold text-2xl text-gray-900">{quiz.title}</h1>
            <p className="text-gray-600">
              {questions.length} questions • Passing score: {quiz.passingScorePercent}%
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong>Instructions:</strong> Answer all questions to the best of your ability. You need to
            score at least {quiz.passingScorePercent}% to pass this quiz and complete the course.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question, index) => {
          const isMultiple = question.type === 'multiple-choice';
          return (
            <div key={question.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-700 font-medium flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-1">{question.questionText}</p>
                  {isMultiple && (
                    <p className="text-sm text-gray-500">Select all that apply</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 ml-11">
                {question.options.map((option) => {
                  const isSelected = (answers[question.id] || []).includes(option.id);
                  return (
                    <label
                      key={option.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type={isMultiple ? 'checkbox' : 'radio'}
                        name={question.id}
                        checked={isSelected}
                        onChange={() => handleAnswerChange(question.id, option.id, isMultiple)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-900">{option.optionText}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Answered {Object.keys(answers).length} of {questions.length} questions
            </p>
            <button
              type="submit"
              disabled={Object.keys(answers).length !== questions.length}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
