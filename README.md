# JSVault

A full-stack developer note-taking application built using the MERN stack. JSVault helps developers organize programming notes, code snippets, and explanations in one place with syntax highlighting, AI-generated summaries, Google authentication, and a modern responsive interface.

---

## Features

- User Authentication
  - Email & Password Login
  - Google OAuth Login
  - Session-based Authentication
  - Protected Routes

- Note Management
  - Create Notes
  - Edit Notes
  - Delete Notes
  - Archive Notes
  - Restore Archived Notes
  - Soft Delete (Trash)

- Code Editor
  - Monaco Editor (VS Code Editor)
  - Syntax Highlighting
  - Multiple Programming Languages

- AI Features
  - Generate concise summaries using Google Gemini API
  - Regenerate summaries anytime
  - Edit AI-generated summaries manually

- Search
  - Search notes by title and tags
  - Live search results

- Responsive Design
  - Mobile-friendly layout
  - Responsive dashboard
  - Consistent UI across pages

---

## Tech Stack

### Frontend

- React.js
- React Router
- Bootstrap
- Monaco Editor

### Backend

- Node.js
- Express.js
- Passport.js
- Express Session

### Database

- MongoDB
- Mongoose

### APIs

- Google OAuth 2.0
- Google Gemini API

---

## Screenshots

### Login Page

![Login](screenshots/login.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Create Note

![Create Note](screenshots/create-note.png)

### Monaco Editor

![Editor](screenshots/editor.png)

---

## Installation

Clone the repository

```bash
git clone https://github.com/<your-username>/JSVault.git
```

Go inside the project

```bash
cd JSVault
```

Install dependencies

```bash
npm install
```

Go to the React project

```bash
cd my-react-app
npm install
```

Start Backend

```bash
npm run dev
```

Start Frontend

```bash
npm start
```

---

## Environment Variables

Create a `.env` file inside the project.

```env
PORT=5174

MONGODB_URI=your_mongodb_connection_string

SESSION_SECRET=your_session_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GEMINI_API_KEY=your_gemini_api_key
```

---

## Folder Structure

```
JSVault
│
├── my-react-app
│   ├── src
│   │   ├── client
│   │   ├── server
│   │   ├── model
│   │   └── public
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

---

## Future Improvements

- Note sharing
- Markdown support
- Rich text editor
- Folder organization
- Deploy online
- Dark mode

---

## License

This project is licensed under the MIT License.
