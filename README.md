# Student Information Portal (ExpressJS)

Web Technology (2304362L) | Practical 5: Web Application Framework: ExpressJS
Author: Abhishek Patil | PRN 202401040050 | Division A (Batch WT1)

A small ExpressJS application that stores student records, lets anyone browse and search them, and lets a logged-in admin add or delete students. Every form is validated on the server with express-validator.

## Features
- Express Router modules: `routes/students.js`, `routes/auth.js`, `routes/api.js`
- Route parameters: `/students/:prn`, `/api/students/:prn` (validated with `param()`)
- Built-in middleware: `express.json`, `express.urlencoded`, `express.static`
- Third-party middleware: `helmet`, `morgan`, `express-session`
- Custom middleware: `requestTimer` (request id + timing), `requireLogin` (authentication check)
- Server-side validation: `express-validator` rules in `middleware/validators.js`
- Central error-handling middleware and 404 handler: `middleware/errorHandler.js`
- Template engine: EJS views with header/footer partials
- Static files: `public/css/style.css`, `public/js/app.js`

## Run locally
```bash
npm install
cp .env.example .env      # optional: or set the variables in your shell
npm start                 # http://localhost:3000
```
Environment variables: `ADMIN_USER` (default `admin`), `ADMIN_PASS` (if not set, a random password is printed in the console at start-up), `SESSION_SECRET`, `PORT`.

PowerShell example: `$env:ADMIN_PASS="MyStrongPass1"; npm start`

## Run tests
```bash
npm test
```

## Routes
| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | / | Public | Home page |
| GET | /students | Public | List, `?q=` search, `?division=` filter |
| GET | /students/:prn | Public | One student (PRN must be 12 digits) |
| GET | /students/new | Admin | Add-student form |
| POST | /students | Admin | Validate and save a student |
| POST | /students/:prn/delete | Admin | Delete a student |
| GET/POST | /login | Public | Admin login |
| POST | /logout | Admin | Logout |
| GET | /api/health | Public | Status JSON |
| GET | /api/students | Public | All students (JSON) |
| GET | /api/students/:prn | Public | One student (JSON) |
| POST | /api/students | Admin | Create student (JSON, 201 / 422 / 409) |

## Deploy on Render
1. Push this folder to a GitHub repository (`node_modules` and `.env` are ignored by `.gitignore`).
2. In Render choose **New > Web Service** and connect the repository.
3. Runtime: Node. Build command: `npm install`. Start command: `npm start`. Instance type: Free.
4. Under **Environment** add `ADMIN_USER`, `ADMIN_PASS` and `SESSION_SECRET`.
5. Deploy and open the generated `onrender.com` URL.

Note: on the free plan the filesystem is reset on every redeploy or restart, so students added online return to the 3 sample records.
