# 📝 CollabNote

A full-stack collaborative note-taking platform inspired by Notion, built with a modern TypeScript stack.  
CollabNote enables users to create, edit, organize, and manage notes through a rich-text editor with authentication and persistent cloud storage.

🌐 Live Demo: https://collabnote-seven.vercel.app

---

## 🚀 Features

### 🔐 Authentication
- Secure user registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Protected API routes

### 📝 Rich Text Editing
- Fully functional rich-text editor powered by TipTap
- Text formatting controls
- Headings, lists, bold, italic, underline support
- Persistent document updates

### 📂 Notes Management
- Create new notes
- View all user notes
- Update note content
- Delete notes
- User-specific note storage

### ⚡ Real-Time Collaboration
- Real-time communication layer using Socket.IO
- WebSocket-based architecture for collaborative editing

### 🐳 Containerization
- Dockerized backend environment
- Docker Compose support for local development

### ☁️ Deployment
- Frontend deployed on Vercel
- Backend deployed as a cloud service
- Cloud PostgreSQL database integration

---

## 🛠 Tech Stack

### Frontend
- React.js
- TypeScript
- Vite
- Tailwind CSS
- TipTap Editor
- Axios
- React Router DOM
- Socket.IO Client

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt
- Socket.IO

### DevOps / Tools
- Docker
- Docker Compose
- Git & GitHub
- Vercel

---

## 🏗 System Architecture

```text
                Client
        React + TypeScript
                |
                |
             REST API
                |
                |
      Node.js + Express Server
                |
        ----------------
        |              |
     Prisma        Socket.IO
        |              |
        |
    PostgreSQL Database
```

---

## 📁 Project Structure

```text
CollabNote/

├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
│   |
│   └── Dockerfile
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── prisma/
│   |
│   └── Dockerfile
│
└── docker-compose.yml
```

---

## ⚙️ Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/CollabNote.git

cd CollabNote
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create `.env`

```env
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_secret_key
```

Run Prisma:

```bash
npx prisma generate
npx prisma migrate dev
```

Start server:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Docker Setup

Run the complete application:

```bash
docker compose up --build
```

---

## API Overview

### Authentication Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Authenticate user |

### Notes Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/notes | Fetch notes |
| POST | /api/notes | Create note |
| GET | /api/notes/:id | Fetch single note |
| PUT | /api/notes/:id | Update note |
| DELETE | /api/notes/:id | Delete note |

---

## Future Improvements

- AI-powered writing assistant
- Document summarization using LLMs
- Advanced collaboration permissions
- Workspace/team support
- Version history

---

## Author

**Rugveda Desai**

Computer Science & Data Science Undergraduate  
Full Stack Development | AI | Product Engineering

---