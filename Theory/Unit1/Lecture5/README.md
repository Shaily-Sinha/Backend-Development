# Student Management API using FastAPI

A simple REST API built using **FastAPI** to demonstrate basic CRUD operations for managing student records.

The API allows users to:

- View all students
- Filter students by branch
- Get a student by ID
- Add a new student
- Update an existing student
- Delete a student

---

## Technologies Used

- Python
- FastAPI
- Uvicorn
- Pydantic

---

## Project Structure

```text
Student-Management-API/
├── main.py
└── README.md
```

---

## Installation

### 1. Install the required packages

```bash
pip install fastapi uvicorn
```

### 2. Run the application

```bash
python main.py
```

The server will start at:

```text
http://127.0.0.1:5000
```

---

## API Documentation

FastAPI automatically generates interactive API documentation.

### Swagger UI

```text
http://127.0.0.1:5000/docs
```

### ReDoc

```text
http://127.0.0.1:5000/redoc
```

---

# API Endpoints

## 1. Root Endpoint

**GET /**

Returns basic information about the API and available endpoints.

```text
http://127.0.0.1:5000/
```

---

## 2. Get All Students

**GET /students**

Returns a list of all students.

```text
http://127.0.0.1:5000/students
```

Example response:

```json
[
  {
    "id": 1,
    "name": "Aarav",
    "branch": "CSE"
  },
  {
    "id": 2,
    "name": "Diya",
    "branch": "ECE"
  },
  {
    "id": 3,
    "name": "Rohan",
    "branch": "IT"
  }
]
```

---

## 3. Filter Students by Branch

Students can be filtered using the `branch` query parameter.

**GET /students?branch=CSE**

Example:

```text
http://127.0.0.1:5000/students?branch=CSE
```

Example response:

```json
[
  {
    "id": 1,
    "name": "Aarav",
    "branch": "CSE"
  }
]
```

The branch filter is case-insensitive.

---

## 4. Get Student by ID

**GET /students/{student_id}**

Example:

```text
http://127.0.0.1:5000/students/1
```

Example response:

```json
{
  "id": 1,
  "name": "Aarav",
  "branch": "CSE"
}
```

If the student does not exist, the API returns:

```text
404 Student not found
```

---

## 5. Create Student

**POST /students**

Request body:

```json
{
  "name": "Ananya",
  "branch": "CSE"
}
```

Example response:

```json
{
  "id": 4,
  "name": "Ananya",
  "branch": "CSE"
}
```

Successful creation returns HTTP status:

```text
201 Created
```

---

## 6. Update Student

**PUT /students/{student_id}**

Example:

```text
PUT /students/1
```

Request body:

```json
{
  "name": "Aarav",
  "branch": "ECE"
}
```

Example response:

```json
{
  "id": 1,
  "name": "Aarav",
  "branch": "ECE"
}
```

If the student ID does not exist, the API returns a `404` response.

---

## 7. Delete Student

**DELETE /students/{student_id}**

Example:

```text
DELETE /students/1
```

A successful deletion returns:

```text
204 No Content
```

If the student does not exist:

```text
404 Student not found
```

---

# CRUD Operations

| Operation | HTTP Method | Endpoint |
|---|---|---|
| Create | POST | `/students` |
| Read All | GET | `/students` |
| Read One | GET | `/students/{student_id}` |
| Update | PUT | `/students/{student_id}` |
| Delete | DELETE | `/students/{student_id}` |

---

# Data Models

## Student

```text
id      : Integer
name    : String
branch  : String
```

## StudentCreate

Used when creating or updating a student.

```text
name    : String
branch  : String
```

The student ID is generated automatically by the application.

---

# Concepts Demonstrated

This project demonstrates:

- REST API development using FastAPI
- GET, POST, PUT and DELETE HTTP methods
- CRUD operations
- Path parameters
- Query parameters
- Pydantic models
- Request and response models
- HTTP status codes
- Exception handling using `HTTPException`
- Automatic Swagger documentation

---

## Note

Student records are currently stored in an **in-memory Python list** rather than a database.

Therefore, any students created, updated, or deleted while the server is running will be reset when the application is restarted.