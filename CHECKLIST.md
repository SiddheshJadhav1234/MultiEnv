# ✅ Deployment Checklist

## Pre-Deployment Checklist

### Initial Setup (One Time)

- [ ] Node.js installed (v16+)
- [ ] MongoDB installed and running
- [ ] Git initialized
- [ ] All dependencies installed (`npm run install-all`)
- [ ] Setup validated (`npm run validate`)

---

## Development Environment

### Before Running
- [ ] MongoDB is running
- [ ] Port 5000 is available (backend)
- [ ] Port 5173 is available (frontend)
- [ ] `.env.development` file exists
- [ ] Database `myapp_dev` is accessible

### Running
```bash
npm run dev
```

### Verification
- [ ] Backend starts on port 5000
- [ ] Frontend starts on port 5173
- [ ] Console shows "ACTIVE ENVIRONMENT: DEVELOPMENT"
- [ ] Console shows "Connected to MongoDB: myapp_dev"
- [ ] Browser opens to http://localhost:5173
- [ ] Environment badge shows "DEVELOPMENT" (green)
- [ ] Health check API works: http://localhost:5000/api/health
- [ ] Can add users successfully
- [ ] Users saved to myapp_dev database

### Git Branch
- [ ] On `develop` branch

---

## Testing Environment

### Before Running
- [ ] MongoDB is running
- [ ] Port 5001 is available (backend)
- [ ] Port 5174 is available (frontend)
- [ ] `.env.testing` file exists
- [ ] Database `myapp_test` is accessible

### Running
```bash
npm run test
```

### Verification
- [ ] Backend starts on port 5001
- [ ] Frontend starts on port 5174
- [ ] Console shows "ACTIVE ENVIRONMENT: TESTING"
- [ ] Console shows "Connected to MongoDB: myapp_test"
- [ ] Browser opens to http://localhost:5174
- [ ] Environment badge shows "TESTING" (blue)
- [ ] Health check API works: http://localhost:5001/api/health
- [ ] Can add users successfully
- [ ] Users saved to myapp_test database (NOT myapp_dev)

### Git Branch
- [ ] On `test` branch

---

## Staging Environment

### Before Running
- [ ] MongoDB is running
- [ ] Port 5002 is available (backend)
- [ ] Port 5175 is available (frontend)
- [ ] `.env.staging` file exists
- [ ] Database `myapp_stage` is accessible

### Running
```bash
npm run stage
```

### Verification
- [ ] Backend starts on port 5002
- [ ] Frontend starts on port 5175
- [ ] Console shows "ACTIVE ENVIRONMENT: STAGING"
- [ ] Console shows "Connected to MongoDB: myapp_stage"
- [ ] Browser opens to http://localhost:5175
- [ ] Environment badge shows "STAGING" (yellow)
- [ ] Health check API works: http://localhost:5002/api/health
- [ ] Can add users successfully
- [ ] Users saved to myapp_stage database

### Git Branch
- [ ] On `stage` branch

---

## Production Environment

### Before Running
- [ ] MongoDB is running
- [ ] Port 5003 is available (backend)
- [ ] Port 5176 is available (frontend)
- [ ] `.env.production` file exists
- [ ] Database `myapp_prod` is accessible
- [ ] Production secrets are secure
- [ ] Backup of production database exists

### Running
```bash
npm run prod
```

### Verification
- [ ] Backend starts on port 5003
- [ ] Frontend starts on port 5176
- [ ] Console shows "ACTIVE ENVIRONMENT: PRODUCTION"
- [ ] Console shows "Connected to MongoDB: myapp_prod"
- [ ] Browser opens to http://localhost:5176
- [ ] Environment badge shows "PRODUCTION" (red)
- [ ] Health check API works: http://localhost:5003/api/health
- [ ] Can add users successfully
- [ ] Users saved to myapp_prod database
- [ ] SSL/TLS configured (if applicable)
- [ ] Monitoring enabled
- [ ] Logging configured

### Git Branch
- [ ] On `main` branch

---

## Environment Isolation Verification

### Database Isolation
- [ ] Development uses `myapp_dev`
- [ ] Testing uses `myapp_test`
- [ ] Staging uses `myapp_stage`
- [ ] Production uses `myapp_prod`
- [ ] No data shared between databases

### Port Isolation
- [ ] Each environment uses unique backend port
- [ ] Each environment uses unique frontend port
- [ ] No port conflicts

### Secret Isolation
- [ ] Each environment has unique JWT_SECRET
- [ ] No shared secrets between environments

---

## Common Issues Checklist

### MongoDB Not Connecting
- [ ] MongoDB service is running
- [ ] DATABASE_URL is correct in .env file
- [ ] Database name matches environment
- [ ] Network connectivity is available

### Port Already in Use
- [ ] Check for other running instances
- [ ] Kill conflicting processes
- [ ] Verify port in .env file

### Environment Not Loading
- [ ] .env file exists in root directory
- [ ] NODE_ENV is set correctly
- [ ] File naming is correct (.env.development, not .env-development)
- [ ] No syntax errors in .env file

### Frontend Can't Connect to Backend
- [ ] Backend is running
- [ ] API_BASE_URL is correct in .env file
- [ ] CORS is configured correctly
- [ ] Ports match between frontend and backend

---

## Security Checklist

### Development
- [ ] Using development secrets (not production)
- [ ] Debug logging enabled
- [ ] CORS allows localhost

### Testing
- [ ] Using test secrets
- [ ] Test data only
- [ ] Isolated from other environments

### Staging
- [ ] Using staging secrets
- [ ] Production-like configuration
- [ ] Limited access

### Production
- [ ] Strong JWT secrets
- [ ] Production database credentials
- [ ] CORS restricted to production domain
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] No debug logging
- [ ] Error handling configured
- [ ] Rate limiting enabled
- [ ] Monitoring active

---

## Git Workflow Checklist

### Feature Development
- [ ] Create feature branch from `develop`
- [ ] Develop on `develop` branch
- [ ] Test with `npm run dev`
- [ ] Commit changes
- [ ] Push to remote

### Testing Phase
- [ ] Merge to `test` branch
- [ ] Test with `npm run test`
- [ ] Verify all features work
- [ ] Fix any issues

### Staging Phase
- [ ] Merge to `stage` branch
- [ ] Test with `npm run stage`
- [ ] Perform UAT (User Acceptance Testing)
- [ ] Get approval

### Production Deployment
- [ ] Merge to `main` branch
- [ ] Backup production database
- [ ] Deploy with `npm run prod`
- [ ] Verify deployment
- [ ] Monitor for issues
- [ ] Rollback plan ready

---

## Maintenance Checklist

### Daily
- [ ] Check application logs
- [ ] Monitor error rates
- [ ] Verify all environments running

### Weekly
- [ ] Review database sizes
- [ ] Check for security updates
- [ ] Update dependencies if needed

### Monthly
- [ ] Backup all databases
- [ ] Review and rotate secrets
- [ ] Performance audit
- [ ] Security audit

---

## Emergency Procedures

### Application Down
1. [ ] Check MongoDB connection
2. [ ] Check process is running
3. [ ] Check logs for errors
4. [ ] Restart application
5. [ ] Verify recovery

### Database Issues
1. [ ] Check MongoDB service
2. [ ] Verify connection string
3. [ ] Check database permissions
4. [ ] Restore from backup if needed

### Environment Confusion
1. [ ] Check console output for environment name
2. [ ] Verify correct .env file is being read
3. [ ] Check NODE_ENV variable
4. [ ] Restart with correct command

---

## Documentation Checklist

- [ ] README.md reviewed
- [ ] QUICKSTART.md followed
- [ ] ARCHITECTURE.md understood
- [ ] SCRIPTS.md referenced
- [ ] Team trained on workflow

---

## Final Verification

### All Environments Working
- [ ] Development environment runs successfully
- [ ] Testing environment runs successfully
- [ ] Staging environment runs successfully
- [ ] Production environment runs successfully

### Complete Isolation
- [ ] Each environment has separate database
- [ ] Each environment has unique ports
- [ ] Each environment has unique secrets
- [ ] No cross-environment data leakage

### Single Terminal Execution
- [ ] One command starts both frontend and backend
- [ ] Both processes run in parallel
- [ ] Ctrl+C stops both processes
- [ ] No manual intervention needed

### Documentation Complete
- [ ] All documentation files present
- [ ] Team understands workflow
- [ ] Troubleshooting guide available
- [ ] Contact information documented

---

**✅ Deployment Ready!**

When all checkboxes are complete, your multi-environment MERN application is ready for production use.
