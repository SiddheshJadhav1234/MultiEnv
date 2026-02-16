# 📜 NPM Scripts Reference

## Installation Scripts

### `npm run install-all`
Installs dependencies for root, backend, and frontend in one command.

```bash
npm run install-all
```

**What it does:**
1. Installs root dependencies (concurrently, cross-env)
2. Installs backend dependencies (express, mongoose, etc.)
3. Installs frontend dependencies (react, vite, etc.)

---

## Environment Scripts

### `npm run dev`
Runs the application in **development** environment.

```bash
npm run dev
```

**Configuration:**
- Environment: development
- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- Database: myapp_dev
- Branch: develop

---

### `npm run test`
Runs the application in **testing** environment.

```bash
npm run test
```

**Configuration:**
- Environment: testing
- Backend: http://localhost:5001
- Frontend: http://localhost:5174
- Database: myapp_test
- Branch: test

---

### `npm run stage`
Runs the application in **staging** environment.

```bash
npm run stage
```

**Configuration:**
- Environment: staging
- Backend: http://localhost:5002
- Frontend: http://localhost:5175
- Database: myapp_stage
- Branch: stage

---

### `npm run prod`
Runs the application in **production** environment.

```bash
npm run prod
```

**Configuration:**
- Environment: production
- Backend: http://localhost:5003
- Frontend: http://localhost:5176
- Database: myapp_prod
- Branch: main

---

## Utility Scripts

### `npm run validate`
Validates the multi-environment setup.

```bash
npm run validate
```

**Checks:**
- ✅ All .env files exist
- ✅ Required variables present
- ✅ Database names configured
- ✅ Ports configured
- ✅ Scripts available

---

### `npm run server`
Runs only the backend server (internal use).

```bash
npm run server
```

Used internally by environment scripts.

---

### `npm run client`
Runs only the frontend client (internal use).

```bash
npm run client
```

Used internally by environment scripts.

---

## Usage Examples

### First Time Setup
```bash
# 1. Install all dependencies
npm run install-all

# 2. Validate setup
npm run validate

# 3. Run development environment
npm run dev
```

### Switching Environments
```bash
# Stop current environment (Ctrl+C)
# Then run desired environment

npm run dev    # Switch to development
npm run test   # Switch to testing
npm run stage  # Switch to staging
npm run prod   # Switch to production
```

### Development Workflow
```bash
# Work on feature
git checkout develop
npm run dev

# Test changes
git checkout test
npm run test

# Stage for review
git checkout stage
npm run stage

# Deploy to production
git checkout main
npm run prod
```

---

## Script Internals

### How Environment Scripts Work

```json
"dev": "cross-env NODE_ENV=development concurrently \"npm run server\" \"npm run client\""
```

**Breakdown:**
1. `cross-env NODE_ENV=development` - Sets environment variable (cross-platform)
2. `concurrently` - Runs multiple commands in parallel
3. `"npm run server"` - Starts backend
4. `"npm run client"` - Starts frontend

Both backend and frontend read from `.env.development` file.

---

## Stopping the Application

Press `Ctrl+C` in the terminal to stop both frontend and backend.

---

## Troubleshooting Scripts

### Dependencies Not Installing?
```bash
# Clear cache and reinstall
npm cache clean --force
npm run install-all
```

### Port Already in Use?
```bash
# Check what's using the port (Windows)
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F
```

### Environment Not Loading?
```bash
# Validate setup
npm run validate

# Check if .env file exists
dir .env.*
```

---

## Adding New Environments

To add a new environment (e.g., "qa"):

1. Create `.env.qa` file
2. Add script to package.json:
   ```json
   "qa": "cross-env NODE_ENV=qa concurrently \"npm run server\" \"npm run client\""
   ```
3. Run: `npm run qa`

---

**Quick Reference:**

| Command | Environment | Backend Port | Frontend Port |
|---------|-------------|--------------|---------------|
| `npm run dev` | development | 5000 | 5173 |
| `npm run test` | testing | 5001 | 5174 |
| `npm run stage` | staging | 5002 | 5175 |
| `npm run prod` | production | 5003 | 5176 |
