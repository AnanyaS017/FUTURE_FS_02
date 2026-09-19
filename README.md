# Mini CRM - Client Lead Management System

A simple and responsive Client Lead Management System (Mini CRM) built using Node.js, Express.js, MongoDB, HTML, CSS, and Vanilla JavaScript.

## Features

- Admin login authentication
- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- Dashboard with lead statistics
- Add new leads
- View leads
- Edit lead status
- Delete leads
- Search leads
- Filter leads by status
- Add notes to leads
- View notes
- Logout functionality
- Responsive user interface

## Technologies Used

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Authentication
- bcrypt
- JSON Web Token (JWT)

## Project Structure

```text
FUTURE_FS_02/
├── config/
│   └── database.js
├── middleware/
│   └── authMiddleware.js
├── routes/
│   ├── authRoutes.js
│   ├── dashboardRoutes.js
│   ├── leadRoutes.js
│   └── noteRoutes.js
├── public/
│   ├── index.html
│   ├── login.html
│   ├── login.css
│   ├── script.js
│   └── style.css
├── createAdmin.js
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md