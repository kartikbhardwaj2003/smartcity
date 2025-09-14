# API Documentation

Base URL: `http://localhost:4000/api`

---

## Auth
### POST `/auth/register`
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "123456",
  "role": "ADMIN"
}
