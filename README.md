# MultiEnv — MERN CI/CD Pipeline

A production-grade MERN stack application with a fully automated CI/CD pipeline across **4 isolated environments** (Development, Testing, Staging, Production), running simultaneously on a self-hosted server via Docker, Nginx, GitHub Actions, and Tailscale.

Every `git push` to the correct branch automatically deploys — no manual steps.

---

## 🏗️ Architecture Overview

```
Developer (git push)
        ↓
GitHub Actions (ubuntu-latest runner)
        ↓  Tailscale VPN tunnel
Your Laptop (Windows Server)
        ↓  deploy.ps1
Docker Compose (profile-based rebuild)
        ↓
Nginx :80 virtual hosting
  ├─ dev.localhost      → backend-dev:5000  +  frontend-dev:4173
  ├─ test.localhost     → backend-test:5001 +  frontend-test:4173
  ├─ staging.localhost  → backend-staging:5002 + frontend-staging:4173
  └─ prod.localhost     → backend-prod:5003 + frontend-prod:4173
        ↓
MongoDB Atlas (separate DB per environment)
```

**Core technologies:**
- **Frontend**: React 19.2 + Vite 7.3.1
- **Backend**: Node.js 18 + Express 4.18 + Mongoose 8.0
- **Containerization**: Docker + Docker Compose (profiles)
- **Reverse Proxy**: Nginx (alpine)
- **CI/CD**: GitHub Actions
- **VPN Tunnel**: Tailscale (GitHub runner → self-hosted server)
- **Database**: MongoDB Atlas (4 isolated databases)

---

## 📁 Project Structure

```
MultiEnv/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← GitHub Actions CI/CD pipeline
├── backend/
│   ├── server.js               ← Express API, dynamic .env loading
│   ├── package.json
│   └── Dockerfile              ← FROM node:18
├── frontend/
│   ├── src/                    ← React 19 app
│   ├── vite.config.js          ← Reads API_BASE_URL at build time
│   ├── package.json
│   └── Dockerfile              ← FROM node:20, build-time ARGs
├── nginx/
│   └── nginx.conf              ← 4 virtual servers (one per environment)
├── scripts/
│   └── deploy.ps1              ← PowerShell deploy script (runs on server)
├── docker-compose.yml          ← 9 services using Docker Compose profiles
├── .env.development            ← PORT=5000, DB=…/Dev
├── .env.testing                ← PORT=5001, DB=…/Test
├── .env.staging                ← PORT=5002, DB=…/Stage
├── .env.production             ← PORT=5003, DB=…/Prod
├── vercel.json                 ← Optional frontend-only Vercel deploy
└── package.json                ← Root scripts (concurrently for local dev)
```

---

## 🌍 Environments

Each environment is fully isolated — its own containers, ports, env vars, database, and virtual hostname.

| Environment | Git Branch | Backend Port | Frontend Port | Nginx Host | MongoDB DB |
|---|---|---|---|---|---|
| Development | `dev` | `5000` | `5173` | `dev.localhost` | `Dev` |
| Testing | `test` | `5001` | `5174` | `test.localhost` | `Test` |
| Staging | `stage` | `5002` | `5175` | `staging.localhost` | `Stage` |
| Production | `main` / `prod` | `5003` | `5176` | `prod.localhost` | `Prod` |

### Environment Variables (per `.env.*` file)

```env
NODE_ENV=<environment>
PORT=<backend_port>
DATABASE_URL=mongodb+srv://<user>:<pass>@cluster/<DB>
JWT_SECRET=<unique_secret_per_env>
CLIENT_URL=http://<env>.localhost
API_BASE_URL=http://localhost:<port>/api
```

---

## 🔄 CI/CD Pipeline

### How It Works

1. Developer pushes to a branch → GitHub Actions triggers
2. Branch name is detected → `DEPLOY_PROFILE` env var is set
3. Tailscale VPN tunnel is created to your self-hosted server
4. SSH into the server via `appleboy/ssh-action`
5. `git reset --hard` syncs the code on the server
6. `deploy.ps1` runs: tears down old containers, removes stale images, rebuilds, starts fresh
7. Nginx hot-reloads — traffic routes to new containers instantly

### Branch → Environment Mapping

| Push to branch | Deploys profile |
|---|---|
| `dev` | `dev` |
| `test` | `test` |
| `stage` | `staging` |
| `main` or `prod` | `prod` |

### GitHub Secrets Required

| Secret | Value |
|---|---|
| `TAILSCALE_AUTHKEY` | Tailscale auth key for VPN tunnel |
| `SERVER_HOST` | Your machine's Tailscale IP (`tailscale ip -4`) |
| `SERVER_USER` | Windows username |
| `SERVER_SSH_KEY` | Contents of `secrets/id_rsa` (private key) |

### Workflow File: `.github/workflows/deploy.yml`

```yaml
on:
  push:
    branches: [dev, test, stage, main, prod]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set deploy profile
        run: |
          BRANCH="${{ github.ref_name }}"
          if [ "$BRANCH" = "prod" ] || [ "$BRANCH" = "main" ]; then
            echo "DEPLOY_PROFILE=prod" >> $GITHUB_ENV
          elif [ "$BRANCH" = "stage" ]; then
            echo "DEPLOY_PROFILE=staging" >> $GITHUB_ENV
          elif [ "$BRANCH" = "test" ]; then
            echo "DEPLOY_PROFILE=test" >> $GITHUB_ENV
          else
            echo "DEPLOY_PROFILE=dev" >> $GITHUB_ENV
          fi
          echo "DEPLOY_BRANCH=$BRANCH" >> $GITHUB_ENV

      - name: Connect to Tailscale
        uses: tailscale/github-action@v3
        with:
          authkey: ${{ secrets.TAILSCALE_AUTHKEY }}

      - name: Deploy to Server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd C:/Users/vivek126/deployments/MultiEnv
            git fetch origin
            git reset --hard origin/${{ env.DEPLOY_BRANCH }}
            git clean -fd
            powershell -ExecutionPolicy Bypass -NonInteractive -File scripts/deploy.ps1 -Profile ${{ env.DEPLOY_PROFILE }}
```

---

## 🐳 Docker & Compose

### Profiles

`docker-compose.yml` uses Docker Compose [profiles](https://docs.docker.com/compose/profiles/) to define all 4 environments in one file. Only the activated profile's services start.

```bash
# Start the dev environment
docker compose --profile dev up -d

# Start the staging environment
docker compose --profile staging up -d

# Nginx has no profile — always running
docker compose up -d nginx
```

### Deploy Script: `scripts/deploy.ps1`

```powershell
# Pulls fresh base images, removes stale images, rebuilds, restarts, reloads nginx
docker pull node:20 ; docker pull node:18
docker compose --profile $Profile down
docker image rm "multienv-frontend-$Profile"
docker image rm "multienv-backend-$Profile"
docker compose --profile $Profile build
docker compose --profile $Profile up -d --force-recreate
docker compose up -d nginx
docker compose exec -T nginx nginx -s reload
```

Stale images are explicitly deleted before rebuilding to prevent Docker's layer cache from serving old code.

### Frontend Build Args

The frontend API URL is **baked into the JavaScript bundle at build time** via Docker `ARG`:

```dockerfile
FROM node:20
ARG API_BASE_URL=http://localhost:5000/api
ARG NODE_ENV=development
ENV API_BASE_URL=$API_BASE_URL
ENV NODE_ENV=$NODE_ENV
RUN npm run build       # Vite inlines these via `define` in vite.config.js
```

Each environment builds a separate image with its own API URL compiled in.

---

## 🌐 Nginx Reverse Proxy

One Nginx container handles all 4 environments via virtual hosting on port 80.

```
HTTP request → nginx:80
  Host: dev.localhost     → frontend-dev:4173 / backend-dev:5000
  Host: staging.localhost → frontend-staging:4173 / backend-staging:5002
  ...
```

- **API routes** (`/api/*`): proxied to the correct backend container
- **Static assets** (`.js`, `.css`, fonts): `Cache-Control: max-age=31536000, immutable` (1 year — Vite uses content hashes)
- **HTML/SPA routes**: `no-cache, no-store` — always fresh
- **`resolver 127.0.0.11`**: Docker's internal DNS used so Nginx doesn't fail when a profile's containers aren't running

---

## 📡 API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Environment, DB name, timestamp |
| `GET` | `/api/config` | Active env and API URL |
| `GET` | `/api/users` | List all users (current env DB) |
| `POST` | `/api/users` | Create a user |

---

## 🚀 Quick Start

### Prerequisites

- Docker Desktop
- Node.js 18+
- Git
- (For CI/CD) Tailscale installed and authenticated on your machine

### Install Dependencies

```bash
npm run install-all
```

### Local Development (without Docker)

```bash
npm run dev      # development (port 5000 + 5173)
npm run test     # testing     (port 5001)
npm run stage    # staging     (port 5002)
npm run prod     # production  (port 5003)
```

### Docker — Manual Deploy

```bash
# Start a specific environment + nginx
docker compose --profile dev up -d
docker compose up -d nginx

# Or run the deploy script directly
powershell -ExecutionPolicy Bypass -File scripts/deploy.ps1 -Profile dev
powershell -ExecutionPolicy Bypass -File scripts/deploy.ps1 -Profile staging
powershell -ExecutionPolicy Bypass -File scripts/deploy.ps1 -Profile prod

# View logs
docker compose logs backend-dev -f
docker compose logs nginx -f

# Check running containers
docker ps
```

### Trigger CI/CD via Git Push

```bash
# Deploy to dev
git checkout dev
git push origin dev

# Promote to test
git checkout test
git merge dev
git push origin test

# Promote to staging
git checkout stage
git merge test
git push origin stage

# Deploy to production
git checkout main
git merge stage
git push origin main
```

---

## 🔒 Environment Isolation

| Isolation Layer | Dev | Test | Staging | Prod |
|---|---|---|---|---|
| Docker containers | ✅ | ✅ | ✅ | ✅ |
| Network ports | ✅ | ✅ | ✅ | ✅ |
| MongoDB database | `Dev` | `Test` | `Stage` | `Prod` |
| JWT secret | unique | unique | unique | unique |
| API URL (compiled in) | dev.localhost | test.localhost | staging.localhost | prod.localhost |
| Nginx virtual host | dev.localhost | test.localhost | staging.localhost | prod.localhost |

---

## 🛠️ Tool Versions

| Tool | Version |
|---|---|
| React | 19.2.0 |
| Vite | 7.3.1 |
| @vitejs/plugin-react | 5.1.1 |
| Express | 4.18.2 |
| Mongoose | 8.0.3 |
| dotenv | 16.3.1 |
| jsonwebtoken | 9.0.2 |
| Node.js (backend image) | 18 LTS |
| Node.js (frontend image) | 20 LTS |
| Nginx | alpine (latest) |
| actions/checkout | v4 |
| tailscale/github-action | v3 |
| appleboy/ssh-action | v1 |
| concurrently | 8.2.2 |
| cross-env | 7.0.3 |

---

## 🔧 Troubleshooting

**`nginx -s reload` fails after deploy:**
```bash
docker compose exec nginx nginx -t   # test config first
docker compose restart nginx
```

**Containers not starting after deploy:**
```bash
docker compose logs backend-dev
docker compose logs frontend-staging
```

**Tailscale tunnel not connecting in CI:**
- Verify `TAILSCALE_AUTHKEY` secret is valid and not expired
- Check Tailscale is running on your machine: `tailscale status`

**Frontend showing wrong API URL:**
- The API URL is baked at Docker build time. Re-run `docker compose --profile <env> build` after changing `docker-compose.yml` build args.

**Port already in use:**
```powershell
netstat -ano | findstr :5000
```

---

## 🤝 Contributing

1. Branch from `dev` for all feature work
2. Push to `dev` — CI auto-deploys to dev environment
3. Merge `dev → test → stage → main` for promotion through environments
4. Never push secrets — `.env.*` files are gitignored in production setups

---

## 📄 License

ISC

---

**Built with ❤️ for enterprise-level multi-environment workflows**
