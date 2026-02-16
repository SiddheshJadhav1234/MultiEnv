# MERN Multi-Environment Application

Professional 4-environment setup with shared environment files and single-terminal execution.

## 🏗️ Architecture

- **Frontend**: React + Vite
- **Backend**: Node.js + Express + MongoDB
- **Environment Management**: Shared root-level `.env` files
- **Execution**: Single terminal command using `concurrently`

## 📁 Project Structure

```
MultiEnv/
├── .env.development          # Development environment variables
├── .env.testing              # Testing environment variables
├── .env.staging              # Staging environment variables
├── .env.production           # Production environment variables
├── package.json              # Root package with concurrently scripts
├── backend/
│   ├── package.json
│   └── server.js             # Express server with dynamic env loading
└── frontend/
    ├── package.json
    ├── vite.config.js        # Vite config to read root env files
    └── src/
        └── App.jsx           # React app using shared env variables
```

## 🌍 Environment Configuration

### Environment Files (Root Level Only)

Each environment has its own isolated configuration:

| Environment | File | Port | Database | Client Port |
|------------|------|------|----------|-------------|
| Development | `.env.development` | 5000 | `myapp_dev` | 5173 |
| Testing | `.env.testing` | 5001 | `myapp_test` | 5174 |
| Staging | `.env.staging` | 5002 | `myapp_stage` | 5175 |
| Production | `.env.production` | 5003 | `myapp_prod` | 5176 |

### Environment Variables

Each `.env` file contains:

```env
NODE_ENV=<environment>
PORT=<backend_port>
DATABASE_URL=mongodb://localhost:27017/myapp_<env>
JWT_SECRET=<unique_secret>
CLIENT_URL=http://localhost:<frontend_port>
API_BASE_URL=http://localhost:<backend_port>/api
```

## 🚀 Installation

### Prerequisites

- Node.js (v16+)
- MongoDB (running locally or remote)
- npm or yarn

### Setup Steps

1. **Clone and install dependencies:**

```bash
cd MultiEnv
npm run install-all
```

This will install dependencies for root, backend, and frontend.

## 🎯 Running the Application

### Single Terminal Execution

Run both frontend and backend together with ONE command:

```bash
# Development environment
npm run dev

# Testing environment
npm run test

# Staging environment
npm run stage

# Production environment
npm run prod
```

### What Happens

- Backend starts on the configured PORT
- Frontend starts on the configured CLIENT_URL port
- Both read from the SAME root-level `.env.<environment>` file
- Console displays active environment and database name

### Expected Console Output

```
========================================
🚀 ACTIVE ENVIRONMENT: DEVELOPMENT
📦 DATABASE: mongodb://localhost:27017/myapp_dev
🔑 JWT_SECRET: ✓ Loaded
🌐 CLIENT_URL: http://localhost:5173
========================================

✅ Connected to MongoDB: myapp_dev
🚀 Server running on port 5000
📍 API: http://localhost:5000/api
```

## 🌿 Git Branch Structure

Map branches to environments for CI/CD workflows:

| Branch | Environment | Command |
|--------|-------------|---------|
| `develop` | development | `npm run dev` |
| `test` | testing | `npm run test` |
| `stage` | staging | `npm run stage` |
| `main` | production | `npm run prod` |

### Workflow Example

```bash
# Working on development
git checkout develop
npm run dev

# Testing changes
git checkout test
npm run test

# Staging review
git checkout stage
npm run stage

# Production deployment
git checkout main
npm run prod
```

## 🔒 Environment Isolation

### Database Separation

Each environment uses a completely separate MongoDB database:

- ✅ `myapp_dev` - Development data
- ✅ `myapp_test` - Testing data
- ✅ `myapp_stage` - Staging data
- ✅ `myapp_prod` - Production data

### Secret Separation

Each environment has unique JWT secrets and configurations:

- ✅ No shared secrets between environments
- ✅ No cross-environment database access
- ✅ Isolated API endpoints per environment

## 🛡️ Validation Rules

- ✅ No shared databases across environments
- ✅ No shared secrets across environments
- ✅ No environment cross-calls
- ✅ Fallback to development if NODE_ENV missing
- ✅ Clear console logging of active environment
- ✅ Single terminal execution
- ✅ One shared environment file per environment

## 📡 API Endpoints

### Health Check
```
GET /api/health
```

Returns environment status and database name.

### Users
```
GET /api/users       # Get all users
POST /api/users      # Create user
```

## 🔧 Troubleshooting

### MongoDB Connection Issues

Ensure MongoDB is running:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Port Already in Use

Check if ports are available:
```bash
# Windows
netstat -ano | findstr :<PORT>

# macOS/Linux
lsof -i :<PORT>
```

### Environment Not Loading

- Verify `.env.<environment>` file exists in root directory
- Check NODE_ENV is set correctly
- Restart the application

## 🎨 Frontend Environment Access

Frontend accesses environment variables through Vite's config:

```javascript
const API_BASE_URL = process.env.API_BASE_URL;
const NODE_ENV = process.env.NODE_ENV;
```

No separate `.env` files in frontend folder - all variables come from root.

## 🏢 Production Deployment

For production deployment:

1. Update `.env.production` with production URLs and secrets
2. Ensure MongoDB is accessible
3. Run: `npm run prod`
4. Consider using PM2 or Docker for process management

## 📝 Notes

- **Cross-platform**: Uses `cross-env` for Windows/Mac/Linux compatibility
- **Concurrency**: Both servers run in parallel with colored output
- **Hot Reload**: Frontend has HMR, backend requires restart on changes
- **Scalability**: Easy to add more environments by creating new `.env.<name>` files

## 🤝 Contributing

1. Create feature branch from `develop`
2. Test in `test` environment
3. Review in `stage` environment
4. Merge to `main` for production

## 📄 License

ISC

---

**Built with ❤️ for enterprise-level multi-environment workflows**
