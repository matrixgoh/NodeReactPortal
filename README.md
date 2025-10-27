# NodeReactPortal

[![Build and Push Docker Image](https://github.com/matrixgoh/NodeReactPortal/actions/workflows/docker-build-push.yml/badge.svg)](https://github.com/matrixgoh/NodeReactPortal/actions/workflows/docker-build-push.yml)
[![Docker](https://img.shields.io/badge/docker-ghcr.io-blue)](https://github.com/matrixgoh/NodeReactPortal/pkgs/container/nodereactportal)

Full-stack application with Node.js backend and React frontend, featuring secure authentication, interactive dashboard, and user profile management. Dockerized deployment in a single container ensures streamlined implementation and efficient operation.

## 🚀 One-Click Deployment

[![Try in PWD](https://raw.githubusercontent.com/play-with-docker/stacks/master/assets/images/button.png)](https://labs.play-with-docker.com/?stack=https://raw.githubusercontent.com/matrixgoh/NodeReactPortal/main/docker-compose.ghcr.yml)

Click the button above to deploy instantly on Play-with-Docker! The container includes built-in health monitoring and comprehensive testing to ensure reliable operation.

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

### 🐳 Using Pre-built Docker Image from GHCR (Fastest)

Pull and run the pre-built image from GitHub Container Registry:

```bash
docker run -d -p 5000:5000 \
  -e JWT_SECRET=your-secret-key \
  ghcr.io/matrixgoh/nodereactportal:latest
```

Or with Docker Compose:

```bash
# Download the compose file
curl -O https://raw.githubusercontent.com/matrixgoh/NodeReactPortal/main/docker-compose.ghcr.yml

# Run the container
docker-compose -f docker-compose.ghcr.yml up -d
```

Then access the application at `http://localhost:5000`

### Using Docker (Build from Source)

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

## Docker Image Distribution

Docker images are automatically built and published to GitHub Container Registry (GHCR) on every push to the main branch and on tagged releases.

### Available Tags

- `latest` - Latest build from the main branch
- `main` - Latest build from the main branch
- `v*` - Semantic version tags (e.g., `v1.0.0`)
- `<branch>-<sha>` - Build from specific commit

### Pull the Image

```bash
docker pull ghcr.io/matrixgoh/nodereactportal:latest
```

### Automated Builds

The project uses GitHub Actions to automatically:
- Build Docker images on every push to main
- Tag images with semantic versioning
- Push images to GitHub Container Registry
- Test the built images to ensure they run correctly

See the [workflow file](.github/workflows/docker-build-push.yml) for details.

## Testing

The repository includes comprehensive container testing to ensure reliability:

### Automated Testing
- Every Docker image build is automatically tested
- All API endpoints are validated
- Health checks ensure container stability
- Authentication and authorization are verified

### Manual Testing
Run comprehensive tests locally:
```bash
./test-container.sh <image-name> <port>
```

For detailed testing instructions, see [TESTING.md](TESTING.md).

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
