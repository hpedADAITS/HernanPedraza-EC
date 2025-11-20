# ================================================================
#  MariaDB Container Reset Script (For Debug/Development)
# ================================================================

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "MariaDB Container Reset Utility" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker status..." -ForegroundColor Yellow

$dockerRunning = $false
try {
    $docker = docker ps 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Docker is running" -ForegroundColor Green
        $dockerRunning = $true
    }
} catch {
    # Docker command failed
}

if (-not $dockerRunning) {
    Write-Host "ERROR: Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and run this script again."
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if MariaDB container exists
Write-Host "Checking for MariaDB container..." -ForegroundColor Yellow

$containerExists = docker ps -a --format "{{.Names}}" 2>$null | Select-String "botak-mariadb"

if (-not $containerExists) {
    Write-Host "ℹ MariaDB container does not exist" -ForegroundColor Cyan
    Read-Host "Press Enter to exit"
    exit 0
}

Write-Host "✓ MariaDB container found" -ForegroundColor Green
Write-Host ""

Write-Host "====================================================" -ForegroundColor Yellow
Write-Host "WARNING: This will delete the MariaDB container" -ForegroundColor Yellow
Write-Host "====================================================" -ForegroundColor Yellow
Write-Host ""

# Check if container is running
$containerRunning = docker ps --format "{{.Names}}" 2>$null | Select-String "botak-mariadb"
if ($containerRunning) {
    Write-Host "ℹ Container is currently RUNNING" -ForegroundColor Cyan
} else {
    Write-Host "ℹ Container is currently STOPPED" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Options:" -ForegroundColor Yellow
Write-Host "  1. Delete container only (keep data volume)" -ForegroundColor Cyan
Write-Host "  2. Delete container AND data volume (WARNING: PERMANENT!)" -ForegroundColor Red
Write-Host "  3. Cancel" -ForegroundColor Cyan
Write-Host ""

$choice = Read-Host "Select option (1-3)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "Stopping MariaDB container..." -ForegroundColor Yellow
    docker stop botak-mariadb 2>$null
    
    Write-Host "Removing MariaDB container..." -ForegroundColor Yellow
    docker rm botak-mariadb
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ MariaDB container removed successfully" -ForegroundColor Green
        Write-Host "  Data volume preserved: sprint15_mariadb_data" -ForegroundColor Cyan
    } else {
        Write-Host "ERROR: Failed to remove container" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

if ($choice -eq "2") {
    Write-Host ""
    Write-Host "====================================================" -ForegroundColor Red
    Write-Host "CAUTION: This will DELETE all MariaDB data" -ForegroundColor Red
    Write-Host "====================================================" -ForegroundColor Red
    Write-Host ""
    
    $confirm = Read-Host "Type 'DELETE' to confirm"
    
    if ($confirm -eq "DELETE") {
        Write-Host ""
        Write-Host "Stopping MariaDB container..." -ForegroundColor Yellow
        docker stop botak-mariadb 2>$null
        
        Write-Host "Removing MariaDB container..." -ForegroundColor Yellow
        docker rm botak-mariadb 2>$null
        
        Write-Host "Removing data volume..." -ForegroundColor Yellow
        docker volume rm sprint15_mariadb_data 2>$null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ MariaDB container and volume removed" -ForegroundColor Green
            Write-Host "  Database will be re-initialized on next startup" -ForegroundColor Cyan
        } else {
            Write-Host "⚠ Some files may not have been removed" -ForegroundColor Yellow
            Write-Host "  You can try: docker volume prune -a" -ForegroundColor Gray
        }
    } else {
        Write-Host "Cancelled - no changes made" -ForegroundColor Cyan
    }
}

if ($choice -eq "3") {
    Write-Host "Cancelled - no changes made" -ForegroundColor Cyan
    Read-Host "Press Enter to exit"
    exit 0
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "1. Run the startup script: RUN_APP.bat or RUN_APP.ps1" -ForegroundColor Green
Write-Host "   (It will recreate and initialize MariaDB)" -ForegroundColor Green
Write-Host ""
Write-Host "2. Or manually restart:" -ForegroundColor Green
Write-Host "   docker-compose up -d mariadb" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to exit"
