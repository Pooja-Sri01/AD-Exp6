# Notes-Taking Application Using MongoDB (MERN Stack)

A clean, functional, and responsive Notes-Taking Web Application built with the **MERN** stack (**MongoDB**, **Express.js**, **React.js**, and **Node.js**).

---

## 🚀 Overview

The application enables users to seamlessly create, view, search, edit, and delete notes. All notes are persisted in a local or cloud **MongoDB** database (`notesDB`) through RESTful API endpoints built with Express.js and Mongoose.

### Key Features

* **Add Notes:** Create notes with a title and description. Validates empty inputs and saves to MongoDB with timestamp tracking (`createdAt`, `updatedAt`).
* **View Notes:** Responsive card grid showing note title, description, and creation/update dates. Automatically fetched from MongoDB on initial page load.
* **Edit Notes:** In-place editing of existing notes. Automatically synchronizes updates to MongoDB and reflects modifications immediately on the UI.
* **Delete Notes:** Deletes notes with a confirmation modal to prevent accidental data loss.
* **Search Notes:** Real-time search bar that filters notes dynamically by matching titles and descriptions.
* **Visual Feedback:** Instant toast notification banners for creation, update, and deletion actions.
* **Modern UI:** Built with Google Fonts (Outfit & Plus Jakarta Sans), smooth micro-interactions, responsive grid layout, and an indigo/purple aesthetic.

---

## 🛠️ Technologies Used

* **Frontend:**
  * React.js (v18)
  * Vite (Fast dev server and bundler)
  * Vanilla CSS with CSS Variables & Responsive Grid
  * Axios (HTTP client for REST API communication)
  * Lucide React (Icons)
* **Backend:**
  * Node.js (v22+)
  * Express.js (REST API framework)
  * Mongoose (MongoDB Object Modeling)
  * Cors (Cross-Origin Resource Sharing)
  * Dotenv (Environment configuration)
* **Database:**
  * MongoDB (`notesDB` database, `notes` collection)

---

## 📁 Project Structure

```text
exp6/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── NoteForm.jsx      # Note creation and edit form
│   │   │   ├── NoteCard.jsx      # Note card display with edit & delete actions
│   │   │   └── SearchBar.jsx     # Real-time search input and filter
│   │   ├── App.jsx               # Main application logic & state
│   │   ├── App.css               # Design system & responsive styles
│   │   └── main.jsx              # React entry point
│   ├── index.html                # HTML entry point with Google Fonts
│   ├── vite.config.js            # Vite configuration with API proxy
│   └── package.json              # Client dependencies and scripts
├── server/
│   ├── models/
│   │   └── Note.js               # Mongoose schema for Note
│   ├── routes/
│   │   └── noteRoutes.js         # Express routes for CRUD endpoints
│   ├── .env                      # Local environment variables
│   ├── .env.example              # Environment variables template
│   ├── server.js                 # Express server & MongoDB connection
│   └── package.json              # Server dependencies and scripts
└── README.md                     # Documentation and execution guide
```

---

## 🔌 REST API Endpoints

Base URL: `http://localhost:5000/api/notes`

| Method | Endpoint | Description | Sample Request Body |
|---|---|---|---|
| `GET` | `/api/notes` | Retrieve all notes (supports `?search=keyword`) | N/A |
| `GET` | `/api/notes/:id` | Retrieve a single note by MongoDB `_id` | N/A |
| `POST` | `/api/notes` | Create a new note | `{"title": "Note 1", "description": "Details"}` |
| `PUT` | `/api/notes/:id` | Update an existing note | `{"title": "Updated", "description": "New details"}` |
| `DELETE` | `/api/notes/:id` | Delete a note by `_id` | N/A |
| `GET` | `/api/health` | Server and database health check | N/A |

### Note Schema Specification

```javascript
{
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

---

## ⚙️ Installation & Execution Instructions

### Prerequisites
1. **Node.js** (v18+ recommended)
2. **MongoDB** installed locally (running on `mongodb://127.0.0.1:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) connection string.

---

### Step 1: Backend Setup

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   * A default `.env` file is already created:
     ```env
     PORT=5000
     MONGODB_URI=mongodb://127.0.0.1:27017/notesDB
     ```
   * If using MongoDB Atlas, replace `MONGODB_URI` with your connection string.

4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server starts on `http://localhost:5000` and automatically connects to `notesDB`.*

---

### Step 2: Frontend Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open the displayed local URL in your web browser (typically `http://localhost:5173` or `http://localhost:5174`).

---

## 🛡️ Error Handling & Validation

* **Client-side validation:** Real-time feedback for empty note title and empty description fields, character counters, and button loading spinners.
* **Server-side validation:** Express routes validate input strings, handle MongoDB `CastError` and invalid ObjectIds with `400 Bad Request`, and return `404 Not Found` when a note does not exist.
* **Connection Resiliency:** Displays a prominent reconnection banner if the backend or MongoDB instance is unreachable.
* **Confirmation Guard:** Deleting notes triggers a confirmation modal before permanent removal from MongoDB.
