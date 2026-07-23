# 🏗️ Architecture

> **CareerOS** — Full-stack architecture documentation.

---

## Table of Contents

- [System Overview](#system-overview)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Authentication Flow](#authentication-flow)
- [Resume Parser Flow](#resume-parser-flow)
- [ATS Analysis Flow](#ats-analysis-flow)
- [Data Flow Diagram](#data-flow-diagram)

---

## System Overview

CareerOS follows a **client-server architecture** with a clear separation of concerns:

```
┌──────────────────────┐         HTTP/JSON          ┌──────────────────────┐
│                      │ ◄──────────────────────►  │                      │
│   Frontend (Vite)    │        JWT Auth           │   Backend (Spring)   │
│   React + TypeScript │                            │   Java 17 + Maven   │
│   Tailwind + Motion  │                            │                     │
│                      │                            │  ┌───────────────┐  │
│   Port: 5173         │                            │  │    MySQL      │  │
│                      │                            │  └───────────────┘  │
└──────────────────────┘                            │                     │
                                                     │  ┌───────────────┐  │
                                                     │  │  File System  │  │
                                                     │  │   uploads/    │  │
                                                     │  └───────────────┘  │
                                                     └──────────────────────┘
```

---

## Frontend Architecture

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 12 |
| Routing | React Router 7 |
| Forms | React Hook Form |
| State | Zustand |
| HTTP Client | Axios |

### Folder Structure

```
frontend/src/
├── app/
│   ├── components/     # App shell (RootAppShell)
│   ├── providers/      # Global providers (AppProviders)
│   └── router/         # Route definitions (AppRouter)
├── assets/             # Static images, icons
├── components/
│   ├── auth/           # Login, Register, ProtectedRoute
│   ├── dashboard/      # Sidebar, Topbar, Cards, Activity
│   ├── features/       # Feature highlight section
│   ├── hero/           # Landing page (Navbar, Content, FloatingCards)
│   ├── layout/         # Root layout wrapper
│   ├── resume/         # UploadZone, Library, CardGrid, ListView, etc.
│   ├── trusted/        # Trusted companies bar
│   └── ui/             # Reusable primitives (Button, Input, Card, Motion)
├── constants/          # Route paths, UI constants
├── contexts/           # AuthContext (login/logout/session)
├── hooks/              # useAppNavigate, useAxiosError, useDebouncedValue
├── layouts/            # RootLayout, DashboardLayout
├── pages/              # Landing, Auth, Dashboard, Resume
├── services/           # API endpoints, HTTP client config
└── theme/              # Design tokens, Tailwind config, CSS variables
```

### Component Architecture

```
App
└── AppProviders (Auth, Router, Theme)
    └── AppRouter
        ├── LandingPage
        │   ├── HeroSection
        │   │   ├── HeroNavbar
        │   │   ├── HeroContent
        │   │   └── HeroFloatingCards
        │   ├── TrustedCompanies
        │   └── Features
        ├── AuthLayout
        │   ├── LoginPage
        │   └── RegisterPage
        └── ProtectedRoute
            └── DashboardLayout
                ├── Sidebar
                ├── Topbar
                └── DashboardPage
                    └── ...
                └── ResumePage
                    ├── UploadZone
                    ├── ResumeLibrary
                    │   ├── ResumeToolbar
                    │   ├── ResumeCardGrid | ResumeListView
                    │   ├── ResumeEmptyState
                    │   └── ResumeRenameModal
                    └── ResumePreview
```

### Key Design Decisions

- **Zustand** over Redux for lightweight global state
- **Framer Motion** for animations and layout transitions
- **React Router v7** for lazy-loaded route-based code splitting
- **Axios interceptors** for automatic JWT token attachment
- **Design tokens** extracted into a centralized theme system
- **Dark-first** color scheme with glassmorphism aesthetics

---

## Backend Architecture

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Spring Boot 3.3 |
| Language | Java 21 |
| Build Tool | Maven |
| Database | MySQL 8 (JPA / Hibernate) |
| Security | Spring Security + JWT (jjwt 0.12) |
| PDF Parsing | Apache PDFBox 3.0 |
| DOCX Parsing | Apache POI 5.3 |
| Validation | Spring Boot Validation |

### Package Structure

```
backend/src/main/java/com/careeros/
├── CareerOSApplication.java        # Spring Boot entry point
├── auth/                            # Authentication layer
│   ├── AuthController.java          # POST /register, POST /authenticate
│   ├── AuthService.java             # Business logic for auth
│   ├── RegisterRequest.java         # DTO
│   ├── AuthenticationRequest.java   # DTO
│   └── AuthenticationResponse.java  # DTO
├── config/                          # Spring configuration
│   ├── ApplicationConfig.java       # Bean definitions (PasswordEncoder, etc.)
│   └── SecurityConfig.java          # Security filter chain
├── exception/                       # Global error handling
│   └── GlobalExceptionHandler.java  # @RestControllerAdvice
├── jwt/                             # JWT utilities
│   ├── JwtService.java              # Token generation & validation
│   └── JwtAuthenticationFilter.java # OncePerRequestFilter
├── user/                            # User management
│   ├── User.java                    # Entity
│   ├── Role.java                    # Enum (USER, ADMIN)
│   ├── UserRepository.java          # JPA repository
│   └── UserService.java             # UserDetailsService impl
├── resume/                          # Resume management
│   ├── ResumeController.java        # Upload, list, get, delete
│   ├── ResumeService.java           # Orchestration (validation→store→parse→save)
│   ├── ResumeParserService.java     # PDFBox + POI text extraction
│   ├── ResumeStorageService.java    # Local filesystem storage
│   ├── ResumeRepository.java        # JPA repository
│   ├── ResumeEntity.java            # Entity (id, userId, metadata, text)
│   ├── ResumeResponse.java          # Response DTO
│   ├── ResumeMetadata.java          # Internal metadata DTO
│   ├── ResumeUploadException.java   # Validation exception
│   └── ResumeNotFoundException.java # Not found exception
└── ats/                             # ATS Engine
    ├── AtsController.java           # Analyze endpoints
    ├── AtsService.java              # Service layer
    ├── AtsAnalyzer.java             # Pipeline orchestrator
    ├── KeywordExtractor.java        # Placeholder keyword extraction
    ├── ResumeScorer.java            # Placeholder scoring + section detection
    ├── AtsResponse.java             # Response DTO
    ├── AtsSuggestion.java           # Suggestion DTO
    └── KeywordMatch.java            # Keyword match DTO
```

### Dependency Injection Flow

```
Controller → Service → Repository → Entity (JPA)
                  → ParserService → PDFBox / POI
                  → StorageService → File System
                  → Analyzer → Extractor + Scorer
```

---

## Authentication Flow

```
┌──────────┐         ┌────────────┐         ┌──────────┐         ┌──────────┐
│  Client  │         │   Filter   │         │ Service  │         │ Database │
└────┬─────┘         └─────┬──────┘         └────┬─────┘         └────┬─────┘
     │                     │                     │                    │
     │  POST /register     │                     │                    │
     │  {email, password}  │                     │                    │
     ├────────────────────►│                     │                    │
     │                     │   No JWT required   │                    │
     │                     ├────────────────────►│                    │
     │                     │                     │  Save user (BCrypt)│
     │                     │                     ├───────────────────►│
     │                     │                     │                    │
     │  201 Created        │                     │                    │
     │◄────────────────────┤◄────────────────────┤◄───────────────────┤
     │                     │                     │                    │
     │  POST /authenticate │                     │                    │
     │  {email, password}  │                     │                    │
     ├────────────────────►│                     │                    │
     │                     │   No JWT required   │                    │
     │                     ├────────────────────►│                    │
     │                     │                     │  Verify credentials│
     │                     │                     ├───────────────────►│
     │                     │                     │                    │
     │  200 OK             │                     │                    │
     │  {token, user}      │                     │                    │
     │◄────────────────────┤◄────────────────────┤◄───────────────────┤
     │                     │                     │                    │
     │  Store token        │                     │                    │
     │  (localStorage)     │                     │                    │
     │                     │                     │                    │
     │  GET /api/v1/*      │                     │                    │
     │  Authorization:     │                     │                    │
     │  Bearer <token>     │                     │                    │
     ├────────────────────►│                     │                    │
     │                     │  Validate JWT       │                    │
     │                     │  Extract email      │                    │
     │                     │  Set SecurityContext│                    │
     │                     ├────────────────────►│                    │
     │                     │                     │  Process request   │
     │                     │                     │  as authenticated  │
     │  200 OK             │                     │                    │
     │◄────────────────────┤◄────────────────────┤                    │
```

### JWT Token Structure

```json
{
  "sub": "user@example.com",
  "iat": 1718000000,
  "exp": 1718086400,
  "roles": ["USER"]
}
```

- **Access Token**: 24-hour expiry
- **Storage**: `localStorage` on the client, `Authorization` header on requests
- **Refresh**: Currently single-token; refresh token support is planned

---

## Resume Parser Flow

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Client  │    │   Resume     │    │    Resume    │    │   Resume     │
│          │    │  Controller  │    │   Service    │    │   Parser     │
└────┬─────┘    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
     │                 │                    │                    │
     │  POST /upload   │                    │                    │
     │  multipart file │                    │                    │
     ├────────────────►│                    │                    │
     │                 │  1. Validate       │                    │
     │                 │  - PDF/DOCX only   │                    │
     │                 │  - Max 5 MB        │                    │
     │                 │  - Not empty       │                    │
     │                 │                    │                    │
     │                 │  2. Store file     │                    │
     │                 ├───────────────────►│                    │
     │                 │                    │  StorageService    │
     │                 │                    │  - UUID filename   │
     │                 │                    │  - Save to uploads/│
     │                 │                    │                    │
     │                 │  3. Parse file     │                    │
     │                 │                    ├───────────────────►│
     │                 │                    │                    │
     │                 │                    │  PDF? → PDFBox     │
     │                 │                    │  DOCX? → POI       │
     │                 │                    │                    │
     │                 │  4. Save metadata  │                    │
     │                 │  + extracted text  │                    │
     │                 │  to MySQL          │                    │
     │                 │                    │                    │
     │  201 Created    │                    │                    │
     │  ResumeResponse │                    │                    │
     │◄────────────────┤◄───────────────────┤◄───────────────────┤
```

### Validation Rules

| Rule | Value |
|------|-------|
| Allowed MIME types | `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| File extensions | `.pdf`, `.docx` |
| Max file size | 5 MB |
| Storage location | `uploads/` (configurable via `application.resume.upload-dir`) |
| Filename strategy | UUID-randomized to prevent collisions |

### Database Schema (resumes table)

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT (PK, AUTO_INCREMENT) | Unique identifier |
| `user_id` | BIGINT (FK → users) | Owner of the resume |
| `original_file_name` | VARCHAR(255) | Original uploaded filename |
| `stored_file_name` | VARCHAR(255) | UUID-based stored filename |
| `file_size` | BIGINT | Size in bytes |
| `file_type` | VARCHAR(10) | `pdf` or `docx` |
| `extracted_text` | MEDIUMTEXT | Parsed text content |
| `upload_date` | DATETIME | Upload timestamp |

---

## ATS Analysis Flow

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Client  │    │     ATS      │    │   ATS        │    │  ATS Analyzer│
│          │    │  Controller  │    │   Service    │    │              │
└────┬─────┘    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
     │                 │                    │                    │
     │  GET /analyze/  │                    │                    │
     │  {resumeId}     │                    │                    │
     ├────────────────►│                    │                    │
     │                 │  Fetch resume      │                    │
     │                 │  + extracted text  │                    │
     │                 ├───────────────────►│                    │
     │                 │                    │                    │
     │                 │                    │  1. extractText() │
     │                 │                    │  (from ParserService)│
     │                 │                    │                    │
     │                 │                    │  2. analyzeText() │
     │                 │                    ├───────────────────►│
     │                 │                    │                    │
     │                 │                    │  3. Pipeline:     │
     │                 │                    │  ┌─────────────┐  │
     │                 │                    │  │Extract      │  │
     │                 │                    │  │Keywords     │  │
     │                 │                    │  └──────┬──────┘  │
     │                 │                    │         ▼         │
     │                 │                    │  ┌─────────────┐  │
     │                 │                    │  │Detect       │  │
     │                 │                    │  │Sections     │  │
     │                 │                    │  └──────┬──────┘  │
     │                 │                    │         ▼         │
     │                 │                    │  ┌─────────────┐  │
     │                 │                    │  │Calculate    │  │
     │                 │                    │  │Score        │  │
     │                 │                    │  └──────┬──────┘  │
     │                 │                    │         ▼         │
     │                 │                    │  ┌─────────────┐  │
     │                 │                    │  │Generate     │  │
     │                 │                    │  │Suggestions  │  │
     │                 │                    │  └─────────────┘  │
     │                 │                    │                    │
     │  200 OK         │                    │                    │
     │  AtsResponse    │                    │                    │
     │◄────────────────┤◄───────────────────┤◄───────────────────┤
```

### Modular Components

| Component | Responsibility | Status |
|-----------|---------------|--------|
| `AtsController` | REST endpoints for analysis | ✅ Placeholder |
| `AtsService` | Integration with ParserService, delegates to Analyzer | ✅ Placeholder |
| `AtsAnalyzer` | Pipeline orchestrator | ✅ Placeholder |
| `KeywordExtractor` | Extract keywords, skills, education, etc. | ✅ Placeholder |
| `ResumeScorer` | Section detection, ATS score calculation | ✅ Placeholder |
| `AtsResponse` | Response DTO with score, keywords, sections, suggestions | ✅ Complete |

### Placeholder Data

The current implementation returns **static placeholder data** to validate the pipeline architecture:

- **Score**: `78/100`
- **Keywords**: 3 sample matches
- **Sections**: 6 standard sections
- **Suggestions**: 5 generic improvement tips

> ⚠️ **No AI models, no LLM, no OpenAI integration.** The ATS engine is intentionally free of AI dependencies. Future implementations will use algorithmic approaches (keyword frequency, TF-IDF, job description comparison).

---

## Data Flow Diagram

```
                         ┌──────────────────────────────┐
                         │         MySQL Database        │
                         │  ┌──────┐  ┌──────┐  ┌────┐ │
                         │  │Users │  │Resumes│  │ ...│ │
                         │  └──┬───┘  └──┬───┘  └────┘ │
                         └─────┼─────────┼──────────────┘
                               │         │
┌──────────────┐    ┌─────────▼─────────▼──────────────┐
│   Browser    │    │         Spring Boot Backend       │
│  ┌────────┐  │    │  ┌────────────────────────────┐   │
│  │React   │  │    │  │  Security Layer            │   │
│  │App     │  │    │  │  ┌──────────┐ ┌─────────┐  │   │
│  │        │──┼────┼──│  │JWT Filter│ │Security │  │   │
│  │ Axios  │  │    │  │  │          │ │Config   │  │   │
│  │ Client │◄─┼────┼──│  └──────────┘ └─────────┘  │   │
│  └────────┘  │    │  └────────────────────────────┘   │
│              │    │                                    │
│  ┌────────┐  │    │  ┌────────────────────────────┐   │
│  │Auth    │  │    │  │  Business Logic            │   │
│  │Context │  │    │  │  ┌──────────┐ ┌──────────┐ │   │
│  │        │  │    │  │  │Auth      │ │Resume    │ │   │
│  │JWT     │  │    │  │  │Service   │ │Service   │ │   │
│  │Storage │  │    │  │  └──────────┘ └────┬─────┘ │   │
│  └────────┘  │    │  │  ┌──────────────────┴─────┐ │   │
│              │    │  │  │  ResumeParserService    │ │   │
│  ┌────────┐  │    │  │  │  ┌───────┐ ┌────────┐  │ │   │
│  │Resume  │  │    │  │  │  │PDFBox │ │POI     │  │ │   │
│  │Library │  │    │  │  │  └───────┘ └────────┘  │ │   │
│  │(Grid/  │  │    │  │  └─────────────────────────┘ │   │
│  │ List)  │  │    │  │  ┌────────────────────────┐   │   │
│  └────────┘  │    │  │  │  AtsAnalyzer           │   │   │
│              │    │  │  │  ┌────────┐┌─────────┐ │   │   │
│  ┌────────┐  │    │  │  │  │Keyword ││Scorer   │ │   │   │
│  │ATS     │  │    │  │  │  │Extract ││         │ │   │   │
│  │Results │  │    │  │  │  └────────┘└─────────┘ │   │   │
│  └────────┘  │    │  │  └────────────────────────┘   │   │
│              │    │  ┌────────────────────────────┐   │   │
│  ┌────────┐  │    │  │  Infrastructure            │   │   │
│  │Upload  │  │    │  │  ┌─────────────┐           │   │   │
│  │Zone    │  │    │  │  │StorageService│          │   │   │
│  └────────┘  │    │  │  └──────┬──────┘           │   │   │
│              │    │  └─────────┼──────────────────┘   │   │
└──────────────┘    └───────────┼───────────────────────┘
                                │
                       ┌────────▼────────┐
                       │   Local File    │
                       │   System        │
                       │   uploads/      │
                       └─────────────────┘
```

---

*Documentation maintained by the CareerOS team. Updated: 2025.*

