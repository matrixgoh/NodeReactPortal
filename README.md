# NodeReactPortal

Full-stack application with Node.js backend and React frontend, featuring secure authentication, interactive dashboard, and user profile management. Dockerized deployment in a single container ensures streamlined implementation and efficient operation.

## Features

- 🔐 **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- 📊 **Interactive Dashboard**: Beautiful landing page with user statistics and quick actions
- 👤 **User Profile Management**: Create and edit user profiles with avatar support
- 🐳 **Docker Deployment**: Single container deployment for easy setup and deployment
- 🎨 **Modern UI**: Clean, responsive design with gradient accents

## Tech Stack

### Backend
- Node.js with Express
- SQLite database
- JWT for authentication
- Bcrypt for password hashing
- CORS enabled

### Frontend
- React 19
- React Router for navigation
- Axios for API calls
- Modern CSS with gradients and animations

### Deployment
- Docker multi-stage build
- Docker Compose for orchestration
- Single container architecture

## Quick Start

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/matrixgoh/NodeReactPortal.git
cd NodeReactPortal
```

2. Build and run with Docker Compose:
```bash
docker-compose up --build
```

3. Access the application at `http://localhost:5000`

### Using Docker without Compose

```bash
docker build -t nodereactportal .
docker run -p 5000:5000 nodereactportal
```

### Manual Setup (Development)

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

3. Start the backend server:
```bash
cd ../backend
npm start
```

4. In a new terminal, start the frontend development server:
```bash
cd frontend
npm start
```

5. Frontend will be available at `http://localhost:3000` (proxies API to backend)

## Usage

1. **Register**: Create a new account with username, email, and password
2. **Login**: Access your account with credentials
3. **Dashboard**: View statistics and quick action cards
4. **Profile**: Update your profile information, bio, and avatar

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Profile
- `GET /api/user/profile` - Get current user profile (requires auth)
- `PUT /api/user/profile` - Update user profile (requires auth)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (requires auth)

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes with middleware
- CORS configuration
- Secure HTTP headers

## Project Structure

```
NodeReactPortal/
├── backend/
│   ├── server.js          # Express server and API routes
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   └── Profile.js
│   │   ├── App.js        # Main app component
│   │   └── App.css       # Global styles
│   └── package.json      # Frontend dependencies
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose configuration
└── README.md            # This file
```

## Development

### Frontend Development
```bash
cd frontend
npm start
```

### Backend Development
```bash
cd backend
npm run dev
```

## Building for Production

### Build Frontend
```bash
cd frontend
npm run build
```

### Run Production Server
```bash
cd backend
NODE_ENV=production npm start
```

## License

ISC

## Author

Matrix Goh
