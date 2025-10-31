# Co-Live MERN Prototype

This is a minimal MERN-stack prototype for the Co-Live Management System.
It includes:
- Backend: Express + Mongoose + JWT auth (signup/login), profile, maintenance requests
- Frontend: React app (minimal), pages for signup/login/dashboard/profile/requests

## Important
- You must create a MongoDB Atlas cluster and database user.
- Copy `.env.example` to `backend/.env` and replace `<db_password>` with your actual DB user's password.
- The `MONGO_URI` example in `.env.example` already contains your cluster host `cluster0.f3onmp8.mongodb.net`.

## Setup & Run

### Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env and replace <db_password> with your password (URL-encode special chars)
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:3000 and backend on http://localhost:5000.

## Normal login flow (implemented)
1. User opens login page.
2. Enters email/password and picks role preference during signup.
3. System verifies credentials and returns token.
4. User is redirected to role-specific dashboard.

## Alternate flows handled
- Invalid email format / missing fields will return 400 with messages.
- Incorrect credentials returns 400 with message.
- Account locked after multiple (3) failed attempts (temporary lock).
- Database connection failures will cause server to exit and log an error.

