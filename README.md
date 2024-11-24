# JK Notes Mobile

JK Notes Mobile is based on JK Notes Web, used ejs and node.js to build, that transfer to mobile note-taking application built with React Native and Express.js.

## Key Features

- **Authentication & Security**
  - JWT-based authentication with refresh tokens
  - Secure password hashing with bcrypt
  - Input validation and sanitization
- **Note Management**
  - Rich text editing with formatting options
  - Image upload and gallery support
  - Real-time auto-save
  - Smart search functionality
  - Note sorting and filtering
  - Bulk operations (delete all)
- **User Experience**

  - Dark/Light theme support with system preference detection
  - Swipe gestures for quick actions
  - Image compression and thumbnail generation

## Tech Stack

### Frontend

- React Native / Expo (evolved from EJS in the web version)
- TypeScript
- Redux Toolkit
- NativeWind (Tailwind CSS)
- React Navigation
- Rich text editor integration
- Native image handling

### Backend

- Node.js / Express.js (enhanced and optimized from the original web version)
- MongoDB / Mongoose
- JWT Authentication
- Image processing with Sharp
- Swagger for API documentation
- Multi-part form handling

## Folder Structure

```
JK-Notes-Mobile/
├── backend/
│   ├── controllers/      # Request handling logic
│   ├── middleware/       # Middleware functions
│   ├── models/           # Database models
│   ├── routes/           # API route definitions
│   ├── uploads/          # Stores images
│   ├── index.js          # Backend entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/          # App screens and navigation
    │   ├── components/   # Reusable components
    │   ├── provider/     # Provider components(for dark mode)
    │   ├── shared/       # Shared logic (hooks, store, types)
    │   ├── utils/        # Utility functions
    │   └── global.css    # Global styles
    ├── app.json          # Expo configuration
    └── package.json
```

### Backend Structure

- `controllers/`: Handles business logic for API endpoints.
- `middleware/`: Contains middleware functions like authentication and error handling.
- `models/`: Defines MongoDB schemas and models.
- `routes/`: Defines API routes and connects them to controllers.

### Frontend Structure

- `src/app/`: Defines app screens and navigation structure using Expo Router.
- `src/components/`: Contains reusable UI components like buttons, input fields, etc.
- `src/shared/`: Manages shared logic including Redux store, custom hooks, and type definitions.
- `src/utils/`: Includes utility functions for API calls, local storage management, etc.

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- MongoDB (you can download it from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) )
- Expo CLI
- iOS Simulator or Android Emulator

### Installation and Setup

1. Clone the repository

   ```bash
   git clone https://github.com/kimjeffsj/JK-Notes-Mobile.git

   cd jk-notes-mobile
   ```

2. Backend setup

   ```bash
   cd backend
   npm install
   # Copy .env.example to .env and set up necessary environment variables
   npm start
   ```

3. Frontend setup
   ```bash
   cd frontend
   npm install
   # Copy .env.example to .env and set up necessary environment variables
   npx expo start
   ```

## Environment Variables

### Backend (.env)

```
# Server Configuration

PORT=4000



# MongoDB Configuration

MONGO_URI=mongodb://localhost:27017/JK-Notes



# JWT Configuration

ACCESS_TOKEN_SECRET=your_access_token_secret

REFRESH_TOKEN_SECRET=your_refresh_token_secret

ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_EXPIRY=7d
```

### Frontend (.env)

```
EXPO_PUBLIC_API_URL=http://localhost:4000
or
EXPO_PUBLIC_API_URL=http://YOUR_IP_ADDRESS:4000
```

For physical devices, use your machine's IP address`

## API Documentation

API documentation is available via Swagger UI:

- Development environment: http://localhost:4000/api-docs

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
