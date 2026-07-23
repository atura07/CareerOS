# 📡 API Reference

> **CareerOS** — REST API documentation.

**Base URL (Development):** `http://localhost:8080`
**Base URL (Production):** *TBD*

---

## Table of Contents

- [Authentication](#authentication)
  - [Register](#register)
  - [Login](#login)
- [Resume APIs](#resume-apis)
  - [Upload Resume](#upload-resume)
  - [List Resumes](#list-resumes)
  - [Get Resume by ID](#get-resume-by-id)
  - [Delete Resume](#delete-resume)
- [ATS APIs](#ats-apis)
  - [Analyze Uploaded Resume](#analyze-uploaded-resume)
  - [Analyze Raw Text](#analyze-raw-text)
- [Error Responses](#error-responses)

---

## Authentication

### Register

Create a new user account.

**Endpoint:** `POST /api/v1/auth/register`

**Request Body:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Validation Rules:**

| Field | Rule |
|-------|------|
| `fullName` | Required, non-blank |
| `email` | Required, valid email format |
| `password` | Required, minimum 6 characters |

**Success Response (201 Created):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

**Error Responses:**

| Status | Description |
|--------|-------------|
| `400 Bad Request` | Validation errors (missing/invalid fields) |
| `409 Conflict` | Email already registered |

---

### Login

Authenticate with existing credentials and receive a JWT token.

**Endpoint:** `POST /api/v1/auth/authenticate`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Validation Rules:**

| Field | Rule |
|-------|------|
| `email` | Required, valid email format |
| `password` | Required, non-blank |

**Success Response (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

**Error Responses:**

| Status | Description |
|--------|-------------|
| `401 Unauthorized` | Invalid email or password |
| `404 Not Found` | Email not registered |

---

> **Authentication Header:** All protected endpoints require the following header:
> ```
> Authorization: Bearer <jwt_token>
> ```

---

## Resume APIs

All resume endpoints are **protected** (require JWT token).

### Upload Resume

Upload a PDF or DOCX resume file.

**Endpoint:** `POST /api/v1/resume/upload`

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | Resume file (PDF or DOCX, max 5 MB) |
| `userId` | Long | No | User ID (default: `1`, temporary) |

**Validation:**

- File extension must be `.pdf` or `.docx`
- File size must not exceed **5 MB**
- File must not be empty

**cURL Example:**

```bash
curl -X POST http://localhost:8080/api/v1/resume/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/resume.pdf" \
  -F "userId=1"
```

**Success Response (201 Created):**

```json
{
  "id": 1,
  "userId": 1,
  "originalFileName": "resume.pdf",
  "fileSize": 245760,
  "fileType": "pdf",
  "uploadDate": "2025-06-10T14:30:00",
  "extractedText": "John Doe\nSoftware Engineer\nExperience...\n"
}
```

**Error Responses:**

| Status | Description |
|--------|-------------|
| `400 Bad Request` | Invalid file type, empty file, or file too large |
| `500 Internal Server Error` | Storage or parsing failure |

---

### List Resumes

Get all resumes for the authenticated user.

**Endpoint:** `GET /api/v1/resume`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `userId` | Long | No | `1` | User ID (temporary) |

**cURL Example:**

```bash
curl -X GET http://localhost:8080/api/v1/resume?userId=1 \
  -H "Authorization: Bearer <token>"
```

**Success Response (200 OK):**

```json
[
  {
    "id": 1,
    "userId": 1,
    "originalFileName": "resume.pdf",
    "fileSize": 245760,
    "fileType": "pdf",
    "uploadDate": "2025-06-10T14:30:00",
    "extractedText": "John Doe\n..."
  },
  {
    "id": 2,
    "userId": 1,
    "originalFileName": "cv.docx",
    "fileSize": 102400,
    "fileType": "docx",
    "uploadDate": "2025-06-09T10:15:00",
    "extractedText": "Jane Doe\n..."
  }
]
```

---

### Get Resume by ID

Get a specific resume by its ID.

**Endpoint:** `GET /api/v1/resume/{id}`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | Long | Resume ID |

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `userId` | Long | No | `1` | User ID (temporary) |

**cURL Example:**

```bash
curl -X GET http://localhost:8080/api/v1/resume/1?userId=1 \
  -H "Authorization: Bearer <token>"
```

**Success Response (200 OK):**

```json
{
  "id": 1,
  "userId": 1,
  "originalFileName": "resume.pdf",
  "fileSize": 245760,
  "fileType": "pdf",
  "uploadDate": "2025-06-10T14:30:00",
  "extractedText": "John Doe\n..."
}
```

**Error Responses:**

| Status | Description |
|--------|-------------|
| `404 Not Found` | Resume not found or access denied |

---

### Delete Resume

Delete a resume by its ID (removes file from disk and record from database).

**Endpoint:** `DELETE /api/v1/resume/{id}`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | Long | Resume ID |

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `userId` | Long | No | `1` | User ID (temporary) |

**cURL Example:**

```bash
curl -X DELETE http://localhost:8080/api/v1/resume/1?userId=1 \
  -H "Authorization: Bearer <token>"
```

**Success Response (204 No Content):**

*(Empty body)*

**Error Responses:**

| Status | Description |
|--------|-------------|
| `404 Not Found` | Resume not found or access denied |

---

## ATS APIs

All ATS endpoints are **protected** (require JWT token).

### Analyze Uploaded Resume

Run ATS analysis on a previously uploaded resume.

**Endpoint:** `GET /api/v1/ats/analyze/{resumeId}`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `resumeId` | Long | Resume ID |

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `userId` | Long | No | `1` | User ID (temporary) |

**cURL Example:**

```bash
curl -X GET http://localhost:8080/api/v1/ats/analyze/1?userId=1 \
  -H "Authorization: Bearer <token>"
```

**Success Response (200 OK):**

```json
{
  "score": 78,
  "keywordMatches": [
    {
      "keyword": "Java",
      "count": 3,
      "category": "programming_language"
    },
    {
      "keyword": "Python",
      "count": 5,
      "category": "programming_language"
    },
    {
      "keyword": "Machine Learning",
      "count": 2,
      "category": "skill"
    }
  ],
  "detectedSections": [
    "Summary",
    "Experience",
    "Education",
    "Skills",
    "Projects",
    "Certifications"
  ],
  "suggestions": [
    {
      "message": "Add a professional summary section at the top of your resume",
      "category": "structure"
    },
    {
      "message": "Use more industry-standard keywords relevant to your target role",
      "category": "keywords"
    },
    {
      "message": "Quantify achievements with metrics and numbers where possible",
      "category": "content"
    },
    {
      "message": "Ensure consistent formatting for all section headers",
      "category": "formatting"
    },
    {
      "message": "Tailor your resume to the specific job description",
      "category": "strategy"
    }
  ]
}
```

---

### Analyze Raw Text

Run ATS analysis on raw text directly (without a file upload).

**Endpoint:** `POST /api/v1/ats/analyze/text`

**Request Body:**

```json
{
  "text": "John Doe\nSoftware Engineer with 5 years of experience in Java, Spring Boot, and React..."
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:8080/api/v1/ats/analyze/text \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"text": "John Doe\nSoftware Engineer with 5 years..."}'
```

**Success Response (200 OK):**

```json
{
  "score": 78,
  "keywordMatches": [
    {
      "keyword": "Java",
      "count": 3,
      "category": "programming_language"
    }
  ],
  "detectedSections": [
    "Summary",
    "Experience",
    "Education",
    "Skills",
    "Projects",
    "Certifications"
  ],
  "suggestions": [
    {
      "message": "Add a professional summary section at the top of your resume",
      "category": "structure"
    }
  ]
}
```

---

## Error Responses

All API errors follow a consistent format:

### Validation Error (400 Bad Request)

```json
{
  "fieldName": "Error message for this field"
}
```

### Business Error (4xx)

```json
{
  "error": "Human-readable error message"
}
```

### General Error (500 Internal Server Error)

```json
{
  "error": "An unexpected error occurred"
}
```

### Common Error Codes

| HTTP Status | Code | Description |
|-------------|------|-------------|
| `400` | Bad Request | Invalid input, validation failure |
| `401` | Unauthorized | Invalid credentials |
| `404` | Not Found | Resource not found |
| `409` | Conflict | Duplicate resource (e.g., email already registered) |
| `500` | Internal Server Error | Unexpected server failure |

---

## Rate Limiting

*Not yet implemented.*

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-06 | v0.1.0 | Initial API release with Auth, Resume, and ATS endpoints |

---

*Documentation maintained by the CareerOS team.*

