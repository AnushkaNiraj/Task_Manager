# Task Manager (HTML, CSS, JS, Node, Express, MongoDB)

## Folder structure
```
task-manager/
├── backend/
│   ├── config/db.js              MongoDB connection
│   ├── models/                   User.js, Task.js
│   ├── controllers/              authController.js, taskController.js
│   ├── routes/                   authRoutes.js, taskRoutes.js 
│   ├── middleware/auth.js        checks the login token
│   ├── server.js                 starts Express, serves the frontend
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── index.html                task page
    ├── login.html                login / register page
    ├── css/style.css             style sheet
    ├── css/extras.css            only the new styles (delete icon, login box)
    └── js/                       api.js, script.js, login.js
```

## Run it
1. Install Node.js and MongoDB (or use a free MongoDB Atlas URI).
2. In `backend/`: copy `.env.example` to `.env`, set `MONGO_URI` and a long random `JWT_SECRET`.
3. `cd backend && npm install && npm start`
4. Open http://localhost:3000/login.html

## API
| Method | URL | What it does |
|---|---|---|
| POST | /api/auth/register | create account |
| POST | /api/auth/login | log in, returns token |
| GET | /api/tasks | your tasks |
| POST | /api/tasks | add a task |
| PATCH | /api/tasks/:id/complete | mark complete |
| DELETE | /api/tasks/:id | delete one task |
| DELETE | /api/tasks | delete all your tasks (Reset button) |
