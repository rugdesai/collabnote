# CollabNote

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

A Notion-inspired collaborative note-taking platform that enables users to create, edit, and manage rich-text documents with real-time synchronization. The application combines secure authentication, rich-text editing, cloud storage, and WebSocket-powered collaboration into a production-ready full-stack application.

---

# Live Demo

**Application:** https://collabnote-seven.vercel.app

**Repository:** https://github.com/rugdesai/collabnote

---

# Preview

## Authentication

<p align="center">
<img src="./assets/login.png" width="900">
</p>

JWT-based authentication with secure user registration, login, and protected application routes.

---

## Dashboard

<p align="center">
<img src="./assets/dashboard.png" width="900">
</p>

A centralized workspace for creating, organizing, and managing personal notes with persistent PostgreSQL storage.

---

## Rich Text Editor

<p align="center">
<img src="./assets/editor.png" width="900">
</p>

Built with Tiptap, supporting:

- Rich text formatting
- Headings
- Lists
- Font customization
- Text colors
- Highlights
- Hyperlinks
- Image embedding
- Automatic saving

---

## Real-Time Collaboration

<p align="center">
<img src="./assets/realtime.png" width="900">
</p>

Multiple users can edit the same document simultaneously using Socket.IO-powered real-time synchronization.

---

# Features

## Authentication

- User registration and login
- JWT-based authentication
- Protected API routes
- Secure password hashing with bcrypt

## Notes Management

- Create, edit, and delete notes
- Auto-save functionality
- Persistent PostgreSQL storage
- Personal workspace management

## Rich Text Editing

- Tiptap Editor
- Rich text formatting
- Headings and lists
- Font customization
- Text highlighting
- Hyperlinks
- Image embedding
- Responsive editing experience

## Real-Time Collaboration

- Live document synchronization
- Multi-user editing sessions
- Socket.IO communication
- Shared collaborative workspace

## Cloud Integration

- Cloudinary image uploads
- PostgreSQL database
- Environment-based configuration
- Production deployment

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Tiptap Editor
- Socket.IO Client
- Axios

## Backend

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Socket.IO
- JWT Authentication
- bcrypt

## Deployment

- Vercel
- Docker
- Cloudinary

---

# System Architecture

```text
                 React + TypeScript
                        │
                        ▼
                 Express REST API
                ┌────────┴────────┐
                ▼                 ▼
      PostgreSQL + Prisma   Socket.IO Server
                │
                ▼
         Cloudinary Storage
```

---

# Database Design

Core entities include:

- User
- Note
- Collaboration
- Invite

The schema supports document ownership, collaborative editing, user invitations, and shared access management.

---

# Local Setup

```bash
git clone https://github.com/rugdesai/collabnote.git

cd collabnote

npm install

npm run dev
```

---

# Project Structure

```text
collabnote/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── prisma/
│   ├── routes/
│   ├── services/
│   └── server.ts
│
└── frontend/
    ├── components/
    ├── hooks/
    ├── pages/
    ├── services/
    └── editor/
```

---

# Highlights

- Real-time collaborative editing using WebSockets
- Rich-text editor powered by Tiptap
- Secure JWT-based authentication
- PostgreSQL with Prisma ORM
- Cloudinary image management
- Dockerized application
- Fully deployed production application
- Modular full-stack architecture

---

# Future Improvements

- AI writing assistant
- Collaborative cursors
- Comments and mentions
- Document version history
- Granular access control
- Offline editing support

---

## Collaboration: approval and realtime editing

Invitations now require an explicit access request and owner approval. Opening a
link never creates membership. Existing collaborators and invites are preserved.
Links are reusable until revoked; revoking links blocks future use but does not
remove existing collaborators or cancel requests already submitted. Rejected
requests remain rejected (including repeated submissions); contact the owner
rather than repeatedly requesting. Owners already have access and do not create
requests for their own notes.

### Setup and deployment

Configure `server/.env` from `server/.env.example`. Set `FRONTEND_URL` to the
frontend origin (production: `https://collabnote-seven.vercel.app`) so generated
links and Socket.IO CORS use the correct host. Set a strong `JWT_SECRET`, the
PostgreSQL `DATABASE_URL`, and optionally `PORT` (default 8000).
Configure the frontend using `frontend/.env.example`: `VITE_API_URL` includes
`/api`; `VITE_SOCKET_URL` is the backend origin. Cloudinary variables retain their
existing image-upload purpose. Vite variables must be set at build time.

Before starting the updated backend, run from `server`:

```sh
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
npm start
```

Build the frontend with `npm install` and `npm run build` in `frontend`.
Deploy frontend and backend together: old clients omit required document versions
and will receive 400 on saves. The new additive migration adds note versions,
invitation revocation timestamps and access requests without resetting data.
The existing migration history is unchanged. Do not run a database reset.

### HTTP contract

All routes below use `/api`. Authentication is `Authorization: Bearer <JWT>`.
Only invitation metadata supports anonymous access; it exposes title and owner
email, never content. An optional valid JWT adds the recipient's request status.
Errors use `{ message }`, with 400 for invalid payloads, 401 for missing/invalid
credentials, and 404 for inaccessible resources (including unauthorized owner
operations). Request decisions return 409 when a different decision already won.

| Method and route | Behavior / response |
| --- | --- |
| `POST /collaborators/:noteId/link` | Owner only. Retrieves an active link or creates a cryptographically random token; `{ link }`. |
| `DELETE /collaborators/:noteId/link` | Owner only. Revokes all active links; 204. |
| `GET /collaborators/invite/:token` | `{ noteId, title, owner, status }`; status is NONE, PENDING, APPROVED or REJECTED. Invalid/revoked links return 404. |
| `POST /collaborators/join/:token` | Authenticated explicit request. `{ noteId, status }`; 202 pending, 200 for existing access/rejected status. Idempotent per user and note. |
| `GET /collaborators/:noteId/requests` | Owner only. Requests with status, timestamps and requester `{ id, email }`. |
| `PATCH /collaborators/:noteId/requests/:requestId` | Owner only. Body `{ status: "APPROVED" \| "REJECTED" }`. Atomically decides a pending request and creates membership on approval; returns request. Repeating the same decision is safe. |
| `GET /collaborators/:noteId` | Authorized members only. Array of collaborator `{ id, email }`. |
| `GET /notes/:id` | Authorized members only. Note including `version` and `isOwner`. |
| `PUT /notes/:id` | Authorized members only. Requires `{ title, content, version }`. Returns `{ conflict: false, note }` after incrementing version, or 409 `{ conflict: true, note }` with current authorized server version. |
| `DELETE /notes/:id` | Owner only; related records removed transactionally; 204. |

Titles have a 500-character maximum; HTML content is limited to 900,000 bytes.
JSON requests have a 1 MB limit. Unique database constraints prevent duplicate
requests and memberships. Decisions, membership creation and versioned saves
use database transactions.

### Socket contract and synchronization

Handshake: `auth: { token: JWT }`. The server loads identity from the database,
disconnects expired tokens and verifies note access before joining a room.

- `join-note(noteId, acknowledgement)` returns `{ note }` or `{ error }`.
- `send-changes({ noteId, title, content, version }, acknowledgement)` uses the
  same persisted save service as HTTP; returns `{ conflict, note }` or `{ error }`.
  Joining the authorized note room is required before sending.
- `receive-changes(note)` broadcasts only successfully persisted versions.
- `user-typing({ noteId })` produces `receive-typing({ noteId, user })`. Identity
  comes from the authenticated server session; client email is ignored.
- `presence({ noteId, users })` lists connected users, deduplicated across tabs.
- `access-request({ noteId })` goes to the owner's authenticated user room;
  `access-decision({ noteId, status })` goes only to the requester.
- `note-deleted({ noteId })` marks an open editor unavailable.

The UI uses a single debounced, serialized HTTP save path, with sockets delivering
persisted title/content updates and typing/presence. It rejoins and reloads on
reconnect, and polls as a fallback. Invitation decisions also have polling fallback.
Tiptap receives remote content with `emitUpdate: false`; it never owns another
socket or a second autosave loop. Unsaved drafts survive refresh in tab-scoped
session storage and are cleared on successful save or logout.

This remains whole-document HTML collaboration, not a CRDT. Simultaneous edits
cannot be merged automatically: an atomic version check rejects stale saves.
The UI preserves the local draft, shows the server version and lets the user
choose the server version, explicitly save their draft instead, or download it.
Choosing the draft replaces the server document only if its reviewed version is
still current. Remote full-document replacements may move the cursor. Realtime
rooms currently assume one backend process; multiple instances need a shared
Socket.IO adapter. Database version checks remain safe across processes.

### Verification

Both production builds and frontend lint can be run with their package scripts.
The integration suite requires an **isolated disposable database** with the
migrations already applied; it never loads the application's configured database:

```sh
cd server
npm run build
TEST_DATABASE_URL=postgresql://USER:PASSWORD@localhost:PORT/TEST_DB node --test tests/collaboration.cjs
```

The suite exercises metadata privacy, explicit/idempotent requests under
concurrency, approval notifications, owner-only actions, rejection, revocation,
unauthenticated sockets, unauthorized room/broadcast attempts, typing identity,
concurrent version conflicts, persistence and owner-only deletion. It creates
and cleans its own users and notes. It uses the frontend's installed Socket.IO
client package, so install dependencies in both directories first.

Browser acceptance checks: share and copy (including denied clipboard access),
open the invitation signed out, register/sign in and resume, request and refresh,
approve from another account, edit title and formatted content in both tabs,
resize an image and refresh, edit simultaneously and resolve a conflict, disconnect
and reconnect, switch notes, reject a second requester, and revoke the link.
