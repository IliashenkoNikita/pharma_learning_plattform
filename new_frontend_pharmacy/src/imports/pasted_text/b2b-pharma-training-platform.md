Act as a senior software architect and full-stack implementation assistant.

Build a production-ready MVP for a B2B pharmaceutical training platform.

Core stack:
- Backend: ASP.NET Core Web API with C#
- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS
- Database: PostgreSQL
- ORM: Entity Framework Core
- Auth: JWT-based authentication with role-based access control
- API style: REST
- File storage: Azure Blob Storage with abstraction layer
- Deployment target: Azure
- Local development: Docker + docker-compose
- API docs: Swagger / OpenAPI
- Configuration: appsettings.json + environment variables
- Clean architecture, modular code, maintainable structure

Project goal:
This platform is for B2B pharmaceutical education and corporate training. Companies buy access for their employees. A company manager invites employees, assigns courses, tracks progress, sees reports, and manages seat usage. Employees watch lessons, read materials, complete quizzes, and finish courses. A superadmin manages the whole platform.

Main roles:
1. Superadmin
   - Full platform access
   - CRUD companies
   - CRUD courses
   - CRUD lessons
   - Upload files
   - Create quizzes
   - Assign courses to companies
   - Activate/deactivate subscriptions
   - Set seat limits
   - View platform-wide analytics

2. Company Manager
   - Belongs to one company
   - Invite/remove employees
   - View company dashboard
   - View seat usage
   - Assign available courses to employees if permitted
   - View employee progress
   - View quiz scores
   - Export reports

3. Employee
   - Belongs to one company
   - View assigned courses
   - Watch lessons
   - Read text and PDF materials
   - Take quizzes
   - Track own progress
   - Complete courses

Required functional modules:
1. Authentication and authorization
   - Login endpoint
   - Password hashing
   - JWT access token generation
   - Role-based authorization
   - Company-scoped authorization
   - Current user endpoint

2. Company management
   - Company entity fields:
     - Id
     - Name
     - PlanName
     - SeatLimit
     - SubscriptionStatus
     - ActiveUntil
     - CreatedAt
     - UpdatedAt

3. User management
   - User entity fields:
     - Id
     - CompanyId nullable for superadmin
     - FirstName
     - LastName
     - Email
     - PasswordHash
     - Role
     - IsActive
     - CreatedAt
     - UpdatedAt
   - Roles:
     - Superadmin
     - Manager
     - Employee
   - Enforce seat limits when creating employees

4. Course management
   - Course entity fields:
     - Id
     - Title
     - Description
     - Category
     - Status (Draft, Published)
     - EstimatedDurationMinutes
     - ThumbnailUrl
     - CreatedAt
     - UpdatedAt
   - CRUD for courses
   - Assign courses to companies

5. Lesson management
   - Lesson entity fields:
     - Id
     - CourseId
     - Title
     - Description
     - OrderIndex
     - VideoUrl
     - TextContent
     - EstimatedDurationMinutes
     - CreatedAt
     - UpdatedAt
   - Optional attached files/PDFs

6. File management
   - UploadedFile entity:
     - Id
     - OriginalFileName
     - BlobName
     - ContentType
     - FileSize
     - Url
     - UploadedAt
   - Azure Blob Storage service abstraction
   - Support lesson attachments and thumbnails

7. Company-course assignments
   - Many-to-many relationship between companies and courses
   - Company can be assigned many courses
   - Course can be assigned to many companies

8. Employee enrollments
   - UserCourseEnrollment entity:
     - Id
     - UserId
     - CourseId
     - AssignedAt
     - StartedAt
     - CompletedAt
     - ProgressPercent
     - Status

9. Lesson progress
   - LessonProgress entity:
     - Id
     - UserId
     - LessonId
     - CompletedAt
     - IsCompleted

10. Quiz system
   - Quiz entity:
     - Id
     - CourseId nullable
     - LessonId nullable
     - Title
     - PassingScorePercent
   - QuizQuestion entity:
     - Id
     - QuizId
     - QuestionText
     - Type
     - OrderIndex
   - QuizOption entity:
     - Id
     - QuestionId
     - OptionText
     - IsCorrect
   - QuizAttempt entity:
     - Id
     - QuizId
     - UserId
     - StartedAt
     - SubmittedAt
     - ScorePercent
     - Passed
   - QuizAnswer entity:
     - Id
     - AttemptId
     - QuestionId
     - SelectedOptionId

11. Reporting
   - Company dashboard summary
   - Employee progress report
   - Quiz performance report
   - CSV export endpoints

12. Subscription management
   - No real payment integration yet
   - Superadmin manually controls plan and active period
   - Company status visible in UI

Non-goals for MVP:
- No mobile app
- No gRPC
- No advanced AI chatbot
- No microservices
- No real payment gateway
- No overengineering
- No multi-tenant white-labeling yet

Architecture requirements:
Use a clean layered structure. Keep business logic out of controllers as much as possible.

Suggested backend project structure:
- src/
  - PharmaTraining.Api
  - PharmaTraining.Application
  - PharmaTraining.Domain
  - PharmaTraining.Infrastructure
- tests/
  - PharmaTraining.Tests

Backend design requirements:
1. Domain layer
   - Entities
   - Enums
   - Interfaces where appropriate

2. Application layer
   - DTOs / request and response models
   - Services / business logic
   - Interfaces
   - Validation

3. Infrastructure layer
   - EF Core DbContext
   - Repository implementations if needed
   - Auth services
   - Token generation
   - Password hashing
   - Azure Blob Storage implementation
   - Seed data

4. API layer
   - Controllers
   - Middleware
   - Dependency injection
   - Swagger
   - Auth config
   - Exception handling
   - CORS

Security requirements:
- Use ASP.NET Core Identity OR custom JWT auth if simpler, but keep it clean
- Hash passwords securely
- Validate input
- Protect endpoints by role
- Enforce company isolation
- Do not expose sensitive data
- Add centralized exception handling middleware
- Use FluentValidation if helpful

Frontend requirements:
Use Next.js App Router with TypeScript and Tailwind.

Required frontend pages:
- Login page
- Superadmin dashboard
- Company manager dashboard
- Employee dashboard
- Companies list and details
- Users list and details
- Courses list
- Course create/edit page
- Course details page
- Lesson create/edit page
- Course player page for employees
- Quiz page
- Reports page
- Subscription info page

Frontend UX requirements:
- Professional B2B admin style
- Sidebar navigation
- Tables for admin data
- Cards for dashboard metrics
- Good empty/loading/error states
- Reusable form and table components
- Service layer for API calls
- Auth context or token handling
- Route protection

REST API requirements:
Create endpoints such as:
- POST /api/auth/login
- GET /api/auth/me
- GET /api/companies
- POST /api/companies
- GET /api/companies/{id}
- PUT /api/companies/{id}
- DELETE /api/companies/{id}
- GET /api/users
- POST /api/users
- GET /api/courses
- POST /api/courses
- GET /api/courses/{id}
- PUT /api/courses/{id}
- DELETE /api/courses/{id}
- POST /api/courses/{id}/assign-company
- POST /api/enrollments/assign
- GET /api/enrollments/my-courses
- POST /api/lesson-progress/complete
- POST /api/quizzes/{id}/submit
- GET /api/reports/company/{companyId}
- GET /api/reports/company/{companyId}/csv
- POST /api/files/upload

Data and seed requirements:
- Seed one superadmin
- Seed one company
- Seed one manager
- Seed a few employees
- Seed a couple of courses, lessons, quizzes
- Make the app runnable with demo data

DevOps/local setup requirements:
- Dockerfile for backend
- Dockerfile for frontend
- docker-compose.yml for frontend + backend + postgres
- Include EF Core migrations
- Include appsettings.Development.json example
- Include environment variable examples

Implementation instructions:
1. First show the complete folder structure for backend and frontend
2. Then list all entities and relationships
3. Then generate the backend step by step:
   - Domain
   - Infrastructure
   - Application
   - API
4. Then generate the frontend step by step
5. Then generate Docker and local setup
6. Then explain how to run everything locally
7. Then explain recommended Azure deployment architecture

Important coding rules:
- Write real code, not pseudocode
- Provide complete files
- Use consistent naming
- Keep the implementation simple and maintainable
- State assumptions clearly if needed
- Continue generating implementation in logical order
- Prefer runnable MVP over theoretical perfection

Start now with:
A. full monorepo folder structure
B. list of entities and relationships
C. then generate the backend files in the correct order