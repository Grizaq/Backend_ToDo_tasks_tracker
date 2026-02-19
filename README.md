# 📝 Todo REST API

A production-ready RESTful API built with **Node.js**, **TypeScript**, and **Express**, featuring JWT authentication, refresh token rotation, email verification, and a clean layered architecture.

---

## Features

- **Authentication & Authorization** — JWT access tokens + secure refresh token rotation with 30-day sessions
- **Email Verification** — OTP-based email verification on registration (via Nodemailer)
- **Password Reset** — Secure OTP-based password reset flow
- **Session Management** — Track active sessions per device; revoke individual or all sessions
- **Todo CRUD** — Full create/read/update/delete with filtering and completion toggling
- **Tag System** — Many-to-many tag relationships scoped per user
- **Request Validation** — Middleware-level input validation with descriptive errors
- **Database Migrations** — Versioned schema migrations with Kysely's migration runner
- **Clean Architecture** — Repository pattern with clear separation: routes → controllers → services → repositories

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express v5 |
| Database | PostgreSQL |
| Query Builder | Kysely (type-safe SQL) |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Email | Nodemailer |
| Testing | Jest + Supertest |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
git clone https://github.com/your-username/todo-api.git
cd todo-api
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=todo_db

# JWT
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRES_IN=1d

# Email (leave empty in dev to use console logging)
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=noreply@yourdomain.com

APP_NAME=TodoAPI
```

### Database Setup & Migrations

```bash
# Run all migrations
npm run migrate
```

### Run the Server

```bash
# Development (ts-node)
npm run dev

# Production
npm run build
npm start
```

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Register a new user |
| POST | `/verify-email` | ❌ | Verify email with OTP |
| POST | `/resend-verification` | ❌ | Resend verification OTP |
| POST | `/login` | ❌ | Login, returns access + refresh tokens |
| POST | `/refresh-token` | ❌ | Rotate refresh token |
| POST | `/logout` | ❌ | Revoke refresh token |
| POST | `/request-password-reset` | ❌ | Send password reset OTP |
| POST | `/reset-password` | ❌ | Reset password with OTP |
| GET | `/me` | ✅ | Get current user profile |
| GET | `/sessions` | ✅ | List active sessions |
| DELETE | `/sessions/:id` | ✅ | Revoke a specific session |
| DELETE | `/sessions` | ✅ | Revoke all other sessions |

### Todos — `/api/todos` *(all require auth)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos` | Get all todos for current user |
| GET | `/todos/:id` | Get a single todo |
| POST | `/todos` | Create a new todo |
| PUT | `/todos/:id` | Update a todo |
| DELETE | `/todos/:id` | Delete a todo |
| PUT | `/todos/:id/toggle` | Toggle completion status |

### Tags — `/api/tags` *(all require auth)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tags` | Get all tags |
| GET | `/tags/used` | Get tags attached to at least one todo |
| GET | `/tags/unused` | Get orphaned tags |
| GET | `/tags/containing/:tagName` | Find todos by tag name |
| POST | `/tags` | Create a new tag |
| DELETE | `/tags/id/:id` | Delete tag by ID |
| DELETE | `/tags/name/:name` | Delete tag by name |

---

## Architecture

```
src/
├── db/
│   ├── schema.ts          # Kysely type definitions
│   ├── index.ts           # DB connection
│   ├── migrate.ts         # Migration runner entry
│   ├── migrator.ts        # Kysely migrator setup
│   └── migrations/        # Versioned SQL migrations
├── middleware/
│   ├── auth.middleware.ts       # JWT verification
│   ├── validation.middleware.ts # Request body validation
│   ├── error.middleware.ts      # Global error handler
│   └── logger.middleware.ts     # Request logger
├── models/                # TypeScript interfaces
├── repositories/          # Data access layer (Kysely)
├── services/              # Business logic layer
├── routes/                # Express router definitions
└── app.ts                 # App entry point
```

The project follows a strict **dependency inversion** approach — services depend on repository interfaces, not concrete implementations. This makes the business logic easy to unit test in isolation.

---

## Auth Flow

1. **Register** → OTP sent to email
2. **Verify Email** → Account activated
3. **Login** → Returns a short-lived JWT access token (1 day) + a long-lived refresh token (30 days, stored as HttpOnly cookie)
4. **Refresh** → Access token renewed; refresh token auto-rotated when nearing expiry (< 7 days remaining)
5. **Logout** → Refresh token revoked server-side

---

## Testing

```bash
npm test                        # All tests
npm run test:coverage           # With coverage report
npm run test:unit               # Unit tests only
npm run test:integration        # Integration tests only
```

---

## Todo Data Model

```json
{
  "id": 1,
  "title": "Build something cool",
  "description": "Optional longer description",
  "completed": false,
  "priority": "high",
  "dueDate": "2025-12-31T00:00:00.000Z",
  "completedAt": null,
  "imageUrls": [],
  "tags": [
    { "id": 1, "name": "work" }
  ],
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

**Priority levels:** `low` | `medium` | `high` | `urgent` | `critical`
