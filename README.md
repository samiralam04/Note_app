# Note App

A modern full-stack note-taking application with OTP and Google authentication, built with React, Express, and PostgreSQL.

## Features

- User authentication via email OTP or Google login
- Secure JWT-based session management
- Create, edit, and delete personal notes
- Responsive, modern UI with React and Framer Motion
- PostgreSQL database with automatic table creation
- Email delivery via Gmail (for OTP)

## Tech Stack

- **Frontend:** React, React Router, Framer Motion, React Icons
- **Backend:** Express, Node.js, PostgreSQL, JWT, Nodemailer
- **Authentication:** Email OTP, Google OAuth
- **Other:** Axios, dotenv, CORS, Helmet

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- PostgreSQL database
- Gmail account for sending OTP emails

### Environment Variables

Create a `.env` file in the root directory with the following:

```
PORT=5000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name

JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

> **Note:** For Gmail, you may need to create an [App Password](https://support.google.com/accounts/answer/185833?hl=en) if 2FA is enabled.

### Installation

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Start the backend server:**

   ```sh
   node src/Backend/server.js
   ```

3. **Start the React frontend:**

   ```sh
   npm start
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
note-app/
  ├── src/
  │   ├── Backend/         # Express backend and database logic
  │   ├── components/      # React components (Dashboard, Login)
  │   ├── utils/           # Utility functions (token management)
  │   ├── App.js           # Main React app
  │   └── index.js         # React entry point
  ├── public/              # Static files and index.html
  ├── .env                 # Environment variables (not committed)
  ├── package.json         # Project dependencies and scripts
  └── README.md            # This file
```

## Usage

- Register/login with your email (OTP will be sent) or Google account.
- Create, edit, and delete your notes securely.
- All notes are private to your account.

## Scripts

- `npm start` — Start the React development server
- `npm run build` — Build the React app for production
- `node src/Backend/server.js` — Start the backend server

## License

MIT

---

Made by Samir Alam
