# CollabNote 📝✨

A Notion-inspired real-time collaborative editor built for creating, managing, and editing rich-text notes with seamless multi-user synchronization.

CollabNote brings together a modern editor experience, secure authentication, real-time updates, cloud image handling, and production-ready deployment.

---

## 🚀 Live Demo

🔗 Live Website: https://collabnote-seven.vercel.app

💻 GitHub Repository: https://github.com/rugdesai/collabnote

---

# 📸 Preview

## Authentication

<img src="./assets/login.png" width="800"/>

Secure authentication system with user registration, login, JWT authorization, and protected application routes.

---

## Dashboard

<img src="./assets/dashboard.png" width="800"/>

A minimal workspace where users can create, manage, and access their notes.

Features:
- Personal notes dashboard
- Recently updated notes
- Persistent database storage

---

## Rich Text Editor

<img src="./assets/editor.png" width="800"/>

A Notion-style editor experience powered by Tiptap.

Features include:

- Rich text formatting
- Headings
- Lists
- Font customization
- Text colors
- Highlighting
- Links
- Image embedding
- Auto-saving notes

---

## Real-Time Collaboration

<img src="./assets/realtime.png" width="800"/>

Multiple clients can edit the same note simultaneously with instant synchronization.

Powered using WebSockets with Socket.IO.

---

# ✨ Features

### 🔐 Authentication

- User registration
- Secure login
- JWT-based authentication
- Protected backend routes

---

### 📝 Notes Management

- Create notes
- Update notes
- Delete notes
- Auto-save functionality
- Persistent storage

---

### 🎨 Rich Text Editing

Built with Tiptap Editor:

- Bold / Italic / Underline formatting
- Headings
- Lists
- Text colors
- Highlights
- Font customization
- Link insertion
- Image support

---

### ⚡ Real-Time Collaboration

- WebSocket based communication
- Live document updates
- Multiple active editing sessions
- Shared collaborative workspace

---

### ☁️ Cloud Integration

- Cloudinary image uploads
- PostgreSQL database hosting
- Environment-based deployment configuration

---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Tiptap Editor
- Socket.IO Client
- Axios

---

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Socket.IO
- JWT Authentication
- bcrypt

---

## Deployment

- Vercel (Frontend)
- Render (Backend)
- Docker
- Cloud PostgreSQL
- Cloudinary

---

# ⚙️ Architecture

```txt
                React + TypeScript
                        |
                        |
                 Express REST API
                        |
          -----------------------------
          |                           |
   PostgreSQL + Prisma          Socket.IO Server
          |
          |
      Cloudinary Storage
```

---

# Database Models

Core database entities:

- User
- Note
- Collaboration
- Invite

Supports note ownership, collaborative editing, and shared access.

---

# Key Learnings

Through CollabNote, I explored:

- Building scalable full-stack applications
- Designing REST APIs
- Authentication and authorization
- Database modeling using Prisma ORM
- Real-time communication using WebSockets
- Rich-text editor customization
- Production deployment workflows
- Docker-based deployment
- Managing environment variables across services

---

# Future Enhancements

- AI-powered writing assistant
- Collaborative cursors
- Comments and mentions
- Document version history
- Advanced permissions

---

# Author

Built by **Rugveda Desai** 🚀