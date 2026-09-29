# 🎓 Alumni Networking Hub

A production-ready full-stack alumni networking platform connecting students and alumni for mentorship, jobs, events, real-time chat, and donations.
> 🚀 **Live Demo:** [https://alumni-network-tau.vercel.app](https://alumni-network-tau.vercel.app)

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 3.3, Spring Security, JWT, Spring Data JPA |
| Database | PostgreSQL 16 |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Real-time | WebSocket (STOMP) |
| Deployment | Docker Compose |

## 🚀 Quick Start (Docker - Recommended)

### Prerequisites
- Docker Desktop installed and running

### Steps
```bash
# 1. Clone or navigate to the project root
cd "Alumni network"

# 2. Copy environment file
cp .env.example .env

# 3. Build and start all services
docker-compose up --build

# 4. Access the application
# Frontend: http://localhost
# Backend API: http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

## 💻 Local Development

### Backend

**Prerequisites**: Java 21+, Maven 3.9+, PostgreSQL 16

```bash
# Start PostgreSQL and create database
createdb alumni_hub

# Run backend
cd backend
mvn spring-boot:run
# API runs at http://localhost:8080
```

### Frontend

**Prerequisites**: Node.js 20+

```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

## 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@alumni.com | Admin@123 |
| **Alumni** | priya.sharma@example.com | Alumni@123 |
| **Student** | aarav.sharma@student.com | Student@123 |

## 📦 Seed Data

On first startup, the application automatically seeds:
- 1 admin account
- 20 alumni profiles (various departments and companies)
- 20 student accounts
- 15 job postings
- 5 events
- 3 donation campaigns

## 📚 API Documentation

Swagger UI is available at: **http://localhost:8080/swagger-ui.html**

All endpoints are documented with request/response schemas.

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/users/alumni` | Alumni directory (search, filter, paginate) |
| GET | `/api/jobs` | List jobs |
| POST | `/api/jobs/{id}/apply` | Apply for job |
| GET | `/api/events` | List events |
| POST | `/api/events/{id}/rsvp` | RSVP to event |
| POST | `/api/mentorship/request` | Send mentorship request |
| GET | `/api/messages/conversations` | Get conversations |
| POST | `/api/messages/send` | Send message |
| GET | `/api/donations/campaigns` | Get campaigns |
| GET | `/api/admin/analytics` | Platform analytics (admin only) |

## 🏗️ Project Structure

```
Alumni network/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/alumninetwork/hub/
│   │   ├── controller/         # REST controllers
│   │   ├── service/            # Business logic
│   │   ├── repository/         # Data access
│   │   ├── entity/             # JPA entities
│   │   ├── dto/                # Data transfer objects
│   │   ├── security/           # JWT, auth filter
│   │   ├── config/             # Spring configuration
│   │   ├── exception/          # Global error handling
│   │   └── websocket/          # WebSocket controllers
│   └── Dockerfile
├── frontend/                   # React application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable components
│   │   ├── services/           # API service functions
│   │   ├── contexts/           # React contexts
│   │   ├── types/              # TypeScript types
│   │   └── lib/                # Axios, utilities
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🔒 Security Features

- BCrypt password hashing
- JWT access tokens (24h) + refresh tokens (7d)
- Role-based authorization (STUDENT, ALUMNI, ADMIN)
- CORS configuration
- Input validation with Bean Validation
- Global exception handling

## 🎨 UI Features

- Dark/Light mode toggle
- Glassmorphism card design
- Gradient hero sections
- Smooth Framer Motion animations
- Fully responsive (mobile, tablet, desktop)
- Skeleton loading states
- Real-time chat interface

## 🐳 Docker Services

| Service | Port | Description |
|---------|------|-------------|
| PostgreSQL | 5432 | Database |
| Spring Boot | 8080 | Backend API |
| Nginx/React | 80 | Frontend |

## 📝 License

MIT License — Built for educational and community purposes.
