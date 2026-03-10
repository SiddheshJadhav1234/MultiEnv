param(
    [Parameter(Mandatory=$true)]
    [string]$Profile
)

$ErrorActionPreference = "Stop"

Write-Host "Pulling base images..."
docker pull node:20
docker pull node:18

Write-Host "Rebuilding containers for profile: $Profile..."
docker compose --profile $Profile down
$null = docker image rm "multienv-frontend-$Profile" 2>&1
$null = docker image rm "multienv-backend-$Profile" 2>&1
docker compose --profile $Profile build
docker compose --profile $Profile up -d --force-recreate
docker compose up -d nginx
docker compose exec -T nginx nginx -s reload

Write-Host "Deploy complete!"
