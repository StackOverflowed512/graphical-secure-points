
# Graphical Password Authentication System - Backend

This is the backend for the Graphical Password Authentication System. It's built with Node.js, Express, and SQL.

## Project Structure

```
backend/
├── config/           # Configuration files (database, environment, etc.)
├── controllers/      # Route controllers
├── middleware/       # Custom middleware functions
├── models/           # Data models
├── routes/           # API routes
├── utils/            # Utility functions
├── server.js         # Entry point
└── package.json      # Dependencies
```

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_db_username
   DB_PASS=your_db_password
   DB_NAME=graphical_auth
   JWT_SECRET=your_jwt_secret
   ```

3. Set up the database:
   - Create a MySQL/PostgreSQL database named `graphical_auth`
   - Run the SQL scripts in the `database/schema.sql` file to create the tables

4. Start the server:
   ```
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user
- `GET /api/auth/me` - Get the current authenticated user

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### GraphicalPasswords Table

```sql
CREATE TABLE graphical_passwords (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  image_id VARCHAR(255) NOT NULL,
  x_coordinate INTEGER NOT NULL,
  y_coordinate INTEGER NOT NULL,
  sequence_number INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, sequence_number)
);
```
