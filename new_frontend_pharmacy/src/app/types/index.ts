// Enums
export enum UserRole {
  Superadmin = 'Superadmin',
  Manager = 'Manager',
  Employee = 'Employee',
}

export enum SubscriptionStatus {
  Active = 'Active',
  Expired = 'Expired',
  Suspended = 'Suspended',
}

export enum CourseStatus {
  Draft = 'Draft',
  Published = 'Published',
}

export enum EnrollmentStatus {
  NotStarted = 'NotStarted',
  InProgress = 'InProgress',
  Completed = 'Completed',
}

// Entities
export interface Company {
  id: string;
  name: string;
  planName: string;
  seatLimit: number;
  subscriptionStatus: SubscriptionStatus;
  activeUntil: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  companyId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  status: CourseStatus;
  estimatedDurationMinutes: number;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  orderIndex: number;
  videoUrl: string | null;
  textContent: string | null;
  estimatedDurationMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  id: string;
  courseId: string | null;
  lessonId: string | null;
  title: string;
  passingScorePercent: number;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  questionText: string;
  type: string;
  orderIndex: number;
  options: QuizOption[];
}

export interface QuizOption {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect?: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  startedAt: string;
  submittedAt: string | null;
  scorePercent: number;
  passed: boolean;
}

export interface UserCourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  assignedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  progressPercent: number;
  status: EnrollmentStatus;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  completedAt: string | null;
  isCompleted: boolean;
}

export interface CompanyCourseAssignment {
  id: string;
  companyId: string;
  courseId: string;
  assignedAt: string;
}

// Auth
export interface AuthUser {
  user: User;
  token: string;
}
