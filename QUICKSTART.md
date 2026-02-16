# 🚀 Quick Start Guide

## Installation (First Time Only)

```bash
# Install all dependencies (root, backend, frontend)
npm run install-all
```

## Running the Application

### Development Environment
```bash
npm run dev
```
- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- Database: myapp_dev

### Testing Environment
```bash
npm run test
```
- Backend: http://localhost:5001
- Frontend: http://localhost:5174
- Database: myapp_test

### Staging Environment
```bash
npm run stage
```
- Backend: http://localhost:5002
- Frontend: http://localhost:5175
- Database: myapp_stage

### Production Environment
```bash
npm run prod
```
- Backend: http://localhost:5003
- Frontend: http://localhost:5176
- Database: myapp_prod

## Key Features

✅ **One Command** - Run both frontend and backend together
✅ **Shared Environment** - Both read from same root `.env` file
✅ **Isolated Databases** - Each environment has separate MongoDB database
✅ **Environment Badge** - Frontend shows active environment
✅ **Health Check** - API endpoint shows environment status

## Testing the Setup

1. Start any environment (e.g., `npm run dev`)
2. Open browser to frontend URL
3. Check environment badge color
4. Add a user to test database connection
5. Verify data is saved to correct database

## Switching Environments

Simply stop the current process (Ctrl+C) and run a different command:

```bash
npm run dev   # Switch to development
npm run test  # Switch to testing
npm run stage # Switch to staging
npm run prod  # Switch to production
```

Each environment is completely isolated!

## Troubleshooting

**MongoDB not running?**
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Port already in use?**
- Stop other instances
- Or change PORT in respective `.env` file

**Environment not loading?**
- Check `.env.<environment>` exists in root
- Restart the application

---

For detailed documentation, see [README.md](README.md)
