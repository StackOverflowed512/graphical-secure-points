
# Graphical Password Authentication System

A secure authentication system using cued click points instead of traditional text-based passwords.

## Features

- User registration and login using graphical passwords
- Sequential image presentation for authentication
- Tolerance zones around click points
- Visual feedback during authentication
- Secure storage of authentication data

## Project Structure

The project is divided into two main parts:

### Frontend (React + Tailwind CSS)

```
src/
├── components/       # Reusable UI components
│   ├── Auth/         # Authentication-related components
│   └── ui/           # Generic UI components
├── context/          # React context for state management
├── pages/            # Page components
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

### Backend (Node.js + SQL)

```
backend/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── database/         # Database schema and migrations
├── middleware/       # Express middleware
├── routes/           # API routes
└── utils/            # Utility functions
```

## Setup Instructions

### Frontend

1. Clone the repository
2. Navigate to the project root
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:8080](http://localhost:8080) in your browser

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```
4. Edit the `.env` file with your database credentials
5. Set up the database:
   - Create a PostgreSQL database
   - Run the SQL scripts in `database/schema.sql`
6. Start the server:
   ```
   npm run dev
   ```

## How It Works

### Registration

1. User enters email and username
2. User selects click points on a sequence of images
3. The coordinates and image IDs are stored securely

### Login

1. User enters email
2. User is presented with the same sequence of images
3. User must click close to the original points (within a tolerance zone)
4. If all points match, the user is authenticated

## Security Considerations

- Click points are stored with reference to image IDs
- Tolerance zones allow for slight inaccuracies in clicking
- Backend validates coordinates with appropriate tolerance
- HTTP-only cookies for JWT storage
- No sensitive information transmitted in responses

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Framer Motion for animations

- Backend:
  - Node.js
  - Express
  - PostgreSQL
  - JSON Web Tokens (JWT) for authentication
