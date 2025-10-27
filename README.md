# NodeReactPortal

Full-stack application with Node.js backend and React frontend, featuring secure authentication, interactive dashboard, and user profile management. Dockerized deployment in a single container ensures streamlined implementation and efficient operation.

## 🚀 Try in Play With Docker

Experience NodeReactPortal instantly in your browser without any installation! Click the button below to deploy the application in a ready-to-use sandbox environment:

[![Try in PWD](https://raw.githubusercontent.com/play-with-docker/stacks/master/assets/images/button.png)](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/matrixgoh/NodeReactPortal/main/stack.yml)

Once deployed, click the port badge (5000) that appears to access the application.

### Quick Start with Pre-built Image

Pull and run the latest pre-built image from GitHub Container Registry:

```bash
docker run -p 5000:5000 -e JWT_SECRET=your-secret-key ghcr.io/matrixgoh/nodereactportal:latest
```

Or use Docker Compose with the pre-built image:

```bash
docker compose -f docker-compose.ghcr.yml up
```

## Features

- 🔐 **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- 📊 **Interactive Dashboard**: Beautiful landing page with user statistics and quick actions
- 👤 **User Profile Management**: Create and edit user profiles with avatar support
- 🐳 **Docker Deployment**: Single container deployment for easy setup and deployment
- 🎨 **Modern UI**: Clean, responsive design with gradient accents

## 📦 Container Images

Pre-built Docker images are automatically published to GitHub Container Registry (GHCR) on every release:

- **Latest stable**: `ghcr.io/matrixgoh/nodereactportal:latest`
- **Specific version**: `ghcr.io/matrixgoh/nodereactportal:v1.0.0`
- **Main branch**: `ghcr.io/matrixgoh/nodereactportal:main`

Images are built for multiple platforms:
- linux/amd64 (x86_64)
- linux/arm64 (ARM64/v8)

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

### Using Pre-built Docker Image (Fastest)

Pull and run the latest image from GitHub Container Registry:

```bash
docker run -p 5000:5000 -e JWT_SECRET=your-secret-key ghcr.io/matrixgoh/nodereactportal:latest
```

Access the application at `http://localhost:5000`

### Using Docker Compose with Pre-built Image

```bash
# Download the compose file
curl -O https://raw.githubusercontent.com/matrixgoh/NodeReactPortal/main/docker-compose.ghcr.yml

# Run the application
docker compose -f docker-compose.ghcr.yml up
```

### Using Docker (Build from Source)

1. Clone the repository:
```bash
git clone https://github.com/matrixgoh/NodeReactPortal.git
cd NodeReactPortal
```

2. Build and run with Docker Compose:
```bash
docker compose up --build
```

3. Access the application at `http://localhost:5000`

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
