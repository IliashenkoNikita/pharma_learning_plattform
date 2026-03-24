import {
  Company,
  Course,
  EnrollmentStatus,
  Lesson,
  Quiz,
  QuizQuestion,
  SubscriptionStatus,
  User,
  UserCourseEnrollment,
  UserRole,
} from '../types';

const API_BASE_URL = ((import.meta as any).env?.VITE_API_URL as string | undefined) ?? 'http://localhost:8081';

const TOKEN_STORAGE_KEY = 'authToken';

function mapUserRole(role: UserRole | number): UserRole {
  if (role === UserRole.Superadmin || role === UserRole.Manager || role === UserRole.Employee) {
    return role;
  }

  if (role === 1) return UserRole.Superadmin;
  if (role === 2) return UserRole.Manager;
  return UserRole.Employee;
}

function mapSubscriptionStatus(value: SubscriptionStatus | string): SubscriptionStatus {
  if (value === SubscriptionStatus.Active || value === SubscriptionStatus.Expired || value === SubscriptionStatus.Suspended) {
    return value;
  }

  if (value.toLowerCase() === 'expired') return SubscriptionStatus.Expired;
  if (value.toLowerCase() === 'suspended') return SubscriptionStatus.Suspended;
  return SubscriptionStatus.Active;
}

function mapEnrollmentStatus(value: EnrollmentStatus | string): EnrollmentStatus {
  if (
    value === EnrollmentStatus.NotStarted ||
    value === EnrollmentStatus.InProgress ||
    value === EnrollmentStatus.Completed
  ) {
    return value;
  }

  if (value.toLowerCase() === 'completed') return EnrollmentStatus.Completed;
  if (value.toLowerCase() === 'inprogress' || value.toLowerCase() === 'in_progress') {
    return EnrollmentStatus.InProgress;
  }
  return EnrollmentStatus.NotStarted;
}

async function request<T>(path: string, method = 'GET', body?: unknown, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const payload = await response.json();
      if (payload?.error) {
        message = payload.error;
      }
    } catch {
      // Ignore parse errors and keep default message.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export async function loginApi(email: string, password: string) {
  const data = await request<{
    accessToken: string;
    userId: string;
    companyId?: string | null;
    email: string;
    fullName: string;
    role: UserRole | number;
  }>('/api/auth/login', 'POST', { email, password });

  return {
    accessToken: data.accessToken,
    userId: data.userId,
    companyId: data.companyId ?? null,
    email: data.email,
    fullName: data.fullName,
    role: mapUserRole(data.role),
  };
}

export async function getCurrentUser(token: string): Promise<User> {
  const data = await request<{
    id: string;
    companyId?: string | null;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole | number;
    isActive: boolean;
  }>('/api/auth/me', 'GET', undefined, token);

  const now = new Date().toISOString();

  return {
    id: data.id,
    companyId: data.companyId ?? null,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    role: mapUserRole(data.role),
    isActive: data.isActive,
    createdAt: now,
    updatedAt: now,
  };
}

export async function getCompanies(token: string): Promise<Company[]> {
  const companies = await request<
    Array<{
      id: string;
      name: string;
      planName: string;
      seatLimit: number;
      subscriptionStatus: SubscriptionStatus | string;
      activeUntil: string;
      createdAt: string;
      updatedAt: string;
    }>
  >('/api/companies', 'GET', undefined, token);

  return companies.map((company) => ({
    ...company,
    subscriptionStatus: mapSubscriptionStatus(company.subscriptionStatus),
  }));
}

export async function getCompanyById(id: string, token: string): Promise<Company> {
  const company = await request<{
    id: string;
    name: string;
    planName: string;
    seatLimit: number;
    subscriptionStatus: SubscriptionStatus | string;
    activeUntil: string;
    createdAt: string;
    updatedAt: string;
  }>(`/api/companies/${id}`, 'GET', undefined, token);

  return {
    ...company,
    subscriptionStatus: mapSubscriptionStatus(company.subscriptionStatus),
  };
}

export function createCompany(
  payload: {
    name: string;
    planName: string;
    seatLimit: number;
    subscriptionStatus: SubscriptionStatus;
    activeUntil: string;
  },
  token: string
) {
  return request<Company>('/api/companies', 'POST', payload, token);
}

export async function getUsers(token: string): Promise<User[]> {
  const users = await request<
    Array<{
      id: string;
      companyId?: string | null;
      firstName: string;
      lastName: string;
      email: string;
      role: UserRole | number;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }>
  >('/api/users', 'GET', undefined, token);

  return users.map((user) => ({
    ...user,
    companyId: user.companyId ?? null,
    role: mapUserRole(user.role),
  }));
}

export function createUser(
  payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    companyId?: string;
    isActive: boolean;
  },
  token: string
) {
  return request<User>('/api/users', 'POST', payload, token);
}

export async function getCourses(token: string): Promise<Course[]> {
  const courses = await request<Course[]>('/api/courses', 'GET', undefined, token);
  return courses.map((course) => ({
    ...course,
    thumbnailUrl:
      course.thumbnailUrl ||
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop',
  }));
}

export async function getCourseById(id: string, token: string): Promise<Course> {
  const course = await request<Course>(`/api/courses/${id}`, 'GET', undefined, token);
  return {
    ...course,
    thumbnailUrl:
      course.thumbnailUrl ||
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop',
  };
}

export function createCourse(
  payload: {
    title: string;
    description: string;
    category: string;
    status: string;
    estimatedDurationMinutes: number;
    thumbnailUrl?: string;
  },
  token: string
) {
  return request<Course>('/api/courses', 'POST', payload, token);
}

export function updateCourse(
  id: string,
  payload: {
    title: string;
    description: string;
    category: string;
    status: string;
    estimatedDurationMinutes: number;
    thumbnailUrl?: string;
  },
  token: string
) {
  return request<Course>(`/api/courses/${id}`, 'PUT', payload, token);
}

export async function getLessonsByCourse(courseId: string, token: string): Promise<Lesson[]> {
  return request<Lesson[]>(`/api/lessons/by-course/${courseId}`, 'GET', undefined, token);
}

export function assignCourseToCompany(courseId: string, companyId: string, token: string) {
  return request<void>(`/api/courses/${courseId}/assign-company`, 'POST', { companyId }, token);
}

export function assignEnrollment(userId: string, courseId: string, token: string) {
  return request<void>('/api/enrollments/assign', 'POST', { userId, courseId }, token);
}

export async function getMyEnrollments(token: string): Promise<UserCourseEnrollment[]> {
  const enrollments = await request<UserCourseEnrollment[]>('/api/enrollments/my-courses', 'GET', undefined, token);
  return enrollments.map((enrollment) => ({
    ...enrollment,
    status: mapEnrollmentStatus(enrollment.status),
  }));
}

export function completeLesson(lessonId: string, token: string) {
  return request<void>('/api/lesson-progress/complete', 'POST', { lessonId }, token);
}

export function submitQuiz(
  quizId: string,
  answers: Array<{ questionId: string; selectedOptionId: string }>,
  token: string
) {
  return request<{ attemptId: string; scorePercent: number; passed: boolean }>(
    `/api/quizzes/${quizId}/submit`,
    'POST',
    { answers },
    token
  );
}

export async function getQuizByCourse(courseId: string, token: string): Promise<Quiz & { questions: QuizQuestion[] }> {
  return request<Quiz & { questions: QuizQuestion[] }>(`/api/quizzes/by-course/${courseId}`, 'GET', undefined, token);
}

export function getCompanyReport(companyId: string, token: string) {
  return request<{
    summary: {
      totalEmployees: number;
      activeEmployees: number;
      seatLimit: number;
      assignedCourses: number;
      completedEnrollments: number;
      averageProgress: number;
    };
    employeeProgress: Array<{
      employeeName: string;
      email: string;
      courseTitle: string;
      progressPercent: number;
      status: string;
    }>;
    quizPerformance: Array<{
      employeeName: string;
      quizTitle: string;
      scorePercent: number;
      passed: boolean;
      submittedAt?: string | null;
    }>;
  }>(`/api/reports/company/${companyId}`, 'GET', undefined, token);
}

export function getPlatformReport(token: string) {
  return request<{
    totalCompanies: number;
    totalActiveSubscriptions: number;
    totalUsers: number;
    totalManagers: number;
    totalEmployees: number;
    totalCourses: number;
    subscriptionsExpiringSoon: number;
    companiesNearSeatLimit: Array<{
      companyId: string;
      companyName: string;
      seatLimit: number;
      seatsUsed: number;
      usagePercent: number;
      activeUntil: string;
    }>;
    recentCompanyActivity: Array<{
      companyId: string;
      companyName: string;
      lastUpdatedAt: string;
      planName: string;
      subscriptionStatus: string;
    }>;
  }>('/api/reports/platform', 'GET', undefined, token);
}

export { API_BASE_URL, request };
