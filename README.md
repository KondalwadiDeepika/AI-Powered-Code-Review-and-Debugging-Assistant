# 🤖 AI-Powered Code Review & Smart Debugging Assistant

A full-stack web application that leverages **Groq's LLaMA 3.3 70B** (via OpenAI-compatible API) to perform intelligent code reviews — detecting bugs, security vulnerabilities, performance issues, and code quality problems — with a built-in analytics dashboard and per-user review history.

## ✨ Features

- JWT Authentication — Secure signup / login with token-based sessions
- AI Code Review — Deep analysis powered by LLaMA 3.3 70B (via Groq)
- Language Auto-Detection — Automatically identifies the programming language
- Bug Detection — Compile-time errors, runtime exceptions, syntax issues, and logical errors
- Security Scanning — SQL injection, XSS, hardcoded secrets, insecure deserialization, and more
- Performance Analysis — Time & space complexity, inefficient patterns
- Severity Classification — LOW / MEDIUM / HIGH / CRITICAL per review
- Scores — Quality, security, and performance scores for every submission
- Review History — Per-user history of all past code reviews
- Analytics Dashboard — Charts for language distribution and severity breakdown
- Monaco Editor — VS Code-grade editor experience in the browser
- Rate Limiting — Per-user request throttling to prevent abuse
- Audit Logging — Full audit trail of all user actions
- Admin Panel — User management and system stats (ADMIN role)
- Quick Analysis — Instant language detection + code metrics (no AI call)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.4 |
| AI | Groq API — LLaMA 3.3 70B |
| Security | Spring Security, JWT (JJWT 0.12.3) |
| Database | PostgreSQL + Spring Data JPA |
| Build | Maven, Lombok |
| Frontend | React 18, Monaco Editor, Recharts, Axios |
| DevOps | Docker, Docker Compose, Nginx |

## 📁 Project Structure

```
AI-Code-Review-Assistant/
├── backend/
│   ├── src/main/java/com/example/smart_code_reviewer/
│   │   ├── audit/           # AuditLog, AuditService, AuditLogRepository
│   │   ├── config/          # SecurityConfig, AiConfig, AppConfig
│   │   ├── controller/      # AuthController, ReviewController, AdminController
│   │   │                    # UserController, AnalysisController
│   │   ├── dto/             # AuthDTOs, ReviewDTOs, AdminDTOs, UserProfileDTOs
│   │   ├── exception/       # GlobalExceptionHandler, custom exceptions
│   │   ├── model/           # User, Review entities
│   │   ├── repository/      # UserRepository, ReviewRepository
│   │   ├── scheduler/       # CleanupScheduler
│   │   ├── security/        # JwtUtils, JwtAuthFilter
│   │   └── service/         # AuthService, CodeReviewService, AdminService
│   │                        # UserProfileService, RateLimiterService, CodeAnalysisService
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API client
│   │   ├── components/      # Layout, Navbar
│   │   ├── hooks/           # useAuth
│   │   └── pages/           # Dashboard, Review, History, Analytics, Login, Signup
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── .env.example
└── .gitignore
```

## 🚀 Getting Started (Local)

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 15+
- Groq API Key → [console.groq.com](https://console.groq.com)

### 1. Get your Groq API Key
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up / log in
3. Click **API Keys → Create API Key**
4. Copy the key

### 2. Configure the backend

Create `backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/smart_code_reviewer
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update

# JWT
app.jwt.secret=your_base64_secret_at_least_32_chars
app.jwt.expiration=86400000

# Groq AI (OpenAI-compatible)
spring.ai.openai.api-key=your_groq_api_key
spring.ai.openai.base-url=https://api.groq.com/openai
spring.ai.openai.chat.options.model=llama-3.3-70b-versatile

# CORS
app.cors.allowed-origins=http://localhost:3000

# Rate Limiting
app.rate-limit.max-requests=10
app.rate-limit.window-seconds=60
```

### 3. Create the database

```sql
CREATE DATABASE smart_code_reviewer;
```

### 4. Run the backend

```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

Backend starts at `http://localhost:8080`

### 5. Run the frontend

```bash
cd frontend
npm install
npm start
```

Frontend starts at `http://localhost:3000`

## 🐳 Docker (Full Stack)

```bash
cp .env.example .env   # fill in your Groq API key and DB credentials
docker-compose up --build
```

Access at `http://localhost:3000`

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | ❌ | Register new user |
| POST | /api/auth/login | ❌ | Login → returns JWT |
| POST | /api/review | ✅ | Submit code for AI review |
| GET | /api/review/{id} | ✅ | Get review by ID |
| GET | /api/review/history | ✅ | User's review history |
| GET | /api/review/analytics | ✅ | Language + severity stats |
| POST | /api/analysis/quick | ✅ | Instant language detection + metrics |
| GET | /api/user/profile | ✅ | Get user profile |
| PUT | /api/user/password | ✅ | Change password |
| PUT | /api/user/email | ✅ | Update email |
| GET | /api/user/rate-limit/status | ✅ | Remaining requests |
| GET | /api/admin/users | ✅ ADMIN | List all users |
| PUT | /api/admin/users/{id}/role | ✅ ADMIN | Update user role |
| DELETE | /api/admin/users/{id} | ✅ ADMIN | Delete user |
| GET | /api/admin/stats | ✅ ADMIN | System statistics |
| GET | /api/admin/audit-logs | ✅ ADMIN | Audit log summary |

> ❌ = No authentication required &nbsp;&nbsp; ✅ = JWT token required

## 🔐 Security Notes

- Never commit your `.env` file or `application.properties` with real credentials
- Generate a strong JWT secret: `openssl rand -base64 32`
- The `.gitignore` already excludes `.env` and `application.properties`

## 👤 Author

**KondalwadiDeepika** — [GitHub](https://github.com/KondalwadiDeepika)
