# 🤖 AI-Powered Code Review & Smart Debugging Assistant

A full-stack web application that leverages **Groq's LLaMA 3.3 70B** (via an OpenAI-compatible API) to perform intelligent code reviews — detecting bugs, security vulnerabilities, performance issues, and code quality problems — with a built-in analytics dashboard and per-user review history.

---

## ✨ Features

- **JWT Authentication** — Secure signup / login with token-based sessions
- **AI Code Review** — Deep analysis powered by LLaMA 3.3 70B (via Groq)
- **Language Auto-Detection** — Automatically identifies the programming language
- **Bug Detection** — Compile-time errors, runtime exceptions, syntax issues, and logical errors
- **Security Scanning** — SQL injection, XSS, hardcoded secrets, insecure deserialization, and more
- **Performance Analysis** — Time & space complexity, inefficient patterns
- **Severity Classification** — `LOW` / `MEDIUM` / `HIGH` / `CRITICAL` per review
- **Scores** — Quality, security, and performance scores for every submission
- **Review History** — Per-user history of all past code reviews
- **Analytics Dashboard** — Charts for language distribution and severity breakdown
- **Monaco Editor** — VS Code-grade editor experience in the browser

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Java 17, Spring Boot 3.4.1, Spring AI 1.0.3, Spring Security, JWT (JJWT 0.12.3), Spring Data JPA, Lombok, Maven |
| **Frontend** | React 18, Monaco Editor, Recharts, React Router v6, Axios, React Markdown |
| **AI** | Groq API — `llama-3.3-70b-versatile` (OpenAI-compatible endpoint) |
| **Database** | PostgreSQL 15 |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## 📁 Project Structure

```
ai-code-review-and-debugging-assistant/
├── backend/
│   ├── src/main/java/com/example/smart_code_reviewer/
│   │   ├── config/          # SecurityConfig, AiConfig (ChatClient bean)
│   │   ├── controller/      # AuthController, ReviewController
│   │   ├── dto/             # AuthDTOs, ReviewDTOs (request/response)
│   │   ├── model/           # User, Review entities
│   │   ├── repository/      # UserRepository, ReviewRepository (JPA)
│   │   ├── security/        # JwtUtils, JwtAuthFilter
│   │   └── service/         # AuthService, CodeReviewService, UserDetailsServiceImpl
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API client (api.js)
│   │   ├── components/      # Layout, Navbar
│   │   ├── hooks/           # useAuth
│   │   └── pages/           # Dashboard, ReviewPage, HistoryPage, AnalyticsPage, LoginPage, SignupPage
│   ├── public/
│   │   └── index.html
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── .env.example
└── .gitignore
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL 15+
- A [Groq API key](https://console.groq.com) (free tier available)

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ai-code-review-and-debugging-assistant.git
cd ai-code-review-and-debugging-assistant
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
# Database
DB_URL=jdbc:postgresql://localhost:5432/code_reviewer
DB_USERNAME=postgres
DB_PASSWORD=your_db_password_here

# Groq API (OpenAI-compatible)
SPRING_AI_OPENAI_API_KEY=your_groq_api_key_here
SPRING_AI_OPENAI_BASE_URL=https://api.groq.com/openai
SPRING_AI_OPENAI_CHAT_OPTIONS_MODEL=llama-3.3-70b-versatile

# JWT (use a random 256-bit base64 string)
JWT_SECRET=change-this-to-a-256-bit-secret-key-in-production

# CORS
CORS_ORIGINS=http://localhost:3000
```

### 3. Create the database

```sql
CREATE DATABASE code_reviewer;
```

### 4. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend starts at `http://localhost:8080`

### 5. Run the frontend

```bash
cd frontend
npm install
npm start
```

Frontend starts at `http://localhost:3000`

---

## 🐳 Docker (Full Stack)

> Make sure you have Docker and Docker Compose installed.

```bash
cp .env.example .env   # fill in your Groq API key and other values
docker-compose up --build
```

Access the app at `http://localhost:3000`

### Docker Services

| Service | Port | Description |
|---------|------|-------------|
| `frontend` | 3000 | React app served via Nginx |
| `backend` | 8080 | Spring Boot REST API |
| `postgres` | 5432 | PostgreSQL database |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|:---:|-------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` |  Login → returns JWT token |
| `POST` | `/api/review` |  Submit code for AI review |
| `GET` | `/api/review/history` |  Get current user's review history |
| `GET` | `/api/review/analytics` |  Get language & severity analytics |

All protected endpoints require `Authorization: Bearer <token>` header.

---

## ⚙️ Backend Configuration

Key settings in `application.properties` (override via environment variables in production):

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/code_reviewer
spring.datasource.username=postgres
spring.datasource.password=your_password

# Groq AI (OpenAI-compatible)
spring.ai.openai.api-key=your_groq_api_key
spring.ai.openai.base-url=https://api.groq.com/openai
spring.ai.openai.chat.options.model=llama-3.3-70b-versatile
spring.ai.openai.chat.options.max-tokens=4096

# JWT
app.jwt.secret=your-256-bit-secret
app.jwt.expiration=86400000

# CORS
app.cors.allowed-origins=http://localhost:3000
```

---

## 🔐 Security Notes

- **Never commit** your `.env` or `application.properties` files with real secrets
- The `.gitignore` is pre-configured to exclude `.env`
- Rotate your JWT secret and Groq API key before deploying to production
- The example `application.properties` in this repo contains placeholder values only

---

## 📊 AI Review Output Structure

Each code review response includes:

- **Language Detected** — auto-identified programming language
- **Severity Level** — `LOW` | `MEDIUM` | `HIGH` | `CRITICAL`
- **Compilation & Execution Status** — can it compile, run, and terminate?
- **Bug Report**
  - Compile-time errors
  - Runtime exceptions
  - Syntax errors
  - Logical errors
  - Performance issues
  - Code quality issues
- **Security Analysis** — SQL injection, XSS, hardcoded credentials, etc.
- **Scores** — Quality score, security score, performance score
- **Refactored Code** — Improved version of the submitted code

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
