# AI-Powered Code Review & Debugging Assistant

A full-stack web application that uses **Ollama AI** to review code for bugs, security vulnerabilities, and performance issues — with a built-in analytics dashboard and review history.

## Tech Stack

**Backend:** Java 17, Spring Boot 3.4, Spring AI, Spring Security, JWT, PostgreSQL, Maven, Lombok  
**Frontend:** React 18, Monaco Editor, Recharts, React Router, Axios  
**AI:** Ollama (llama3.2:3b)  
**DevOps:** Docker, Docker Compose, Nginx

## Features

- JWT-based authentication (signup / login)
- AI code review with language auto-detection
- Security vulnerability scanning (SQL injection, XSS, hardcoded secrets)
- Bug severity levels: LOW / MEDIUM / HIGH / CRITICAL
- Performance analysis (time & space complexity)
- Quality, security, and performance scores
- Review history per user
- Analytics dashboard with language and severity charts
- Monaco Editor (VS Code experience in the browser)

## Project Structure

```
ai-code-reviewer/
├── backend/
│   ├── src/main/java/com/example/smart_code_reviewer/
│   │   ├── config/          # SecurityConfig, AiConfig
│   │   ├── controller/      # AuthController, ReviewController
│   │   ├── dto/             # Request / response DTOs
│   │   ├── model/           # User, Review entities
│   │   ├── repository/      # JPA repositories
│   │   ├── security/        # JwtUtils, JwtAuthFilter
│   │   └── service/         # AuthService, CodeReviewService
│   ├── src/main/resources/
│   │   └── application.properties
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

## Getting Started (Local)

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 15+
- [Ollama](https://ollama.com) running locally

### 1. Set up environment variables

```bash
# Pull the model first
ollama pull llama3.2:3b

cp .env.example .env
# Fill in your values in .env
```

### 2. Create the database

```sql
CREATE DATABASE code_reviewer;
```

### 3. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

Backend starts at `http://localhost:8080`

### 4. Run the frontend

```bash
cd frontend
npm install
npm start
```

Frontend starts at `http://localhost:3000`

## Docker (Full Stack)

```bash
# Pull the model first
ollama pull llama3.2:3b

cp .env.example .env   # fill in your values
docker-compose up --build
```

Access at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | ❌ | Register |
| POST | /api/auth/login | ❌ | Login → JWT |
| POST | /api/review | ✅ | Submit code for review |
| GET | /api/review/history | ✅ | Review history |
| GET | /api/review/analytics | ✅ | Language + severity stats |
