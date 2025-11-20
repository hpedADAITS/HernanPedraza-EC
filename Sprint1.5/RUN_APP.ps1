# ================================================================
#  Botak Application Startup Script with MariaDB & LM Studio
# ================================================================

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Starting Botak Application Stack" -ForegroundColor Cyan
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

# Check if lms CLI is available
Write-Host "Checking for LM Studio CLI (lms)..." -ForegroundColor Yellow

$lmsCommand = $null
try {
    $lmsCommand = Get-Command lms -ErrorAction SilentlyContinue
}
catch {
    # lms command not found
}

if (-not $lmsCommand) {
    Write-Host "ERROR: LM Studio CLI (lms) is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please ensure LM Studio is installed with CLI support:" -ForegroundColor Cyan
    Write-Host "1. Download LM Studio from: https://lmstudio.ai/" -ForegroundColor Yellow
    Write-Host "2. Install using the default installer"
    Write-Host "3. Enable CLI in LM Studio settings: Settings > Advanced > Enable CLI"
    Write-Host "4. The 'lms' command should be available in your PATH"
    Write-Host ""
    Write-Host "To verify installation, run: lms --version" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✓ LM Studio CLI found" -ForegroundColor Green
Write-Host ""

# Check if LM Studio server is running on port 1234
Write-Host "Checking LM Studio API server..." -ForegroundColor Yellow

$lmStudioRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:1234/v1/models" -Method GET -ErrorAction SilentlyContinue -TimeoutSec 2
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ LM Studio server is already running on port 1234" -ForegroundColor Green
        $lmStudioRunning = $true
        
        # Check if a model is loaded
        try {
            $models = $response.Content | ConvertFrom-Json
            if ($models.data -and $models.data.Count -gt 0) {
                Write-Host "✓ Models available: $($models.data[0].id)" -ForegroundColor Green
            } else {
                Write-Host "⚠ No models loaded. Please load a model in LM Studio." -ForegroundColor Yellow
            }
        } catch {
            # Continue even if we can't parse the response
        }
    }
} catch {
    # LM Studio server not running
}

if (-not $lmStudioRunning) {
    Write-Host "LM Studio server not detected on port 1234" -ForegroundColor Yellow
    Write-Host "Starting LM Studio server..." -ForegroundColor Yellow
    
    # Start LM Studio server in background
    try {
        $process = Start-Process -FilePath "lms" -ArgumentList "server", "start" -PassThru -WindowStyle Hidden
        Write-Host "LM Studio server started (PID: $($process.Id))" -ForegroundColor Green
        
        echo ""
        echo "Waiting for LM Studio server to be ready (this may take up to 30 seconds)..." -ForegroundColor Yellow
        
        $ready = $false
        for ($i = 1; $i -le 30; $i++) {
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:1234/v1/models" -Method GET -ErrorAction SilentlyContinue -TimeoutSec 2
                if ($response.StatusCode -eq 200) {
                    Write-Host "✓ LM Studio server is ready!" -ForegroundColor Green
                    
                    # Check for loaded models
                    try {
                        $models = $response.Content | ConvertFrom-Json
                        if ($models.data -and $models.data.Count -gt 0) {
                            Write-Host "✓ Loaded model: $($models.data[0].id)" -ForegroundColor Green
                        } else {
                            Write-Host "⚠ Warning: No models are currently loaded" -ForegroundColor Yellow
                            Write-Host "Please load a model in LM Studio before using the chatbot" -ForegroundColor Yellow
                        }
                    } catch {
                        # Continue
                    }
                    
                    $ready = $true
                    break
                }
            } catch {
                # Still waiting
            }
            
            if ($i % 5 -eq 0) {
                Write-Host "Waiting... (Attempt $i/30)" -ForegroundColor Gray
            }
            Start-Sleep -Seconds 1
        }
        
        if (-not $ready) {
            Write-Host "WARNING: LM Studio server may not be fully ready, but continuing..." -ForegroundColor Yellow
            Write-Host "If the app fails to connect, run: lms server start" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "ERROR: Failed to start LM Studio server" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Try running manually: lms server start" -ForegroundColor Cyan
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""

# Check if MariaDB image exists
Write-Host "Checking for MariaDB Docker image..." -ForegroundColor Yellow

$mariadbImage = docker images --format "{{.Repository}}:{{.Tag}}" 2>$null | Select-String "^mariadb:latest$"

if (-not $mariadbImage) {
    Write-Host "MariaDB image not found. Pulling from Docker Hub..." -ForegroundColor Yellow
    Write-Host "This may take a few minutes..." -ForegroundColor Gray
    
    docker pull mariadb:latest
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to pull MariaDB image" -ForegroundColor Red
        Write-Host "Check your internet connection and try again."
        Read-Host "Press Enter to exit"
        exit 1
    }
    
    Write-Host "✓ MariaDB image pulled successfully" -ForegroundColor Green
} else {
    Write-Host "✓ MariaDB image found" -ForegroundColor Green
}

Write-Host ""

# Check if MariaDB is already running and healthy
Write-Host "Checking for existing containers..." -ForegroundColor Yellow

$mariadbRunning = docker ps 2>$null | Select-String "botak-mariadb"
$mariadbHealthy = $false

if ($mariadbRunning) {
    $health = docker inspect botak-mariadb --format='{{.State.Health.Status}}' 2>$null
    if ($health -eq 'healthy') {
        Write-Host "✓ MariaDB is already running and healthy" -ForegroundColor Green
        $mariadbHealthy = $true
    } else {
        Write-Host "⚠ MariaDB is running but not healthy yet. Waiting..." -ForegroundColor Yellow
    }
} else {
    Write-Host "Starting MariaDB and Backend containers..." -ForegroundColor Yellow
    docker-compose down 2>$null
    docker-compose up -d mariadb backend
}

# Wait for MariaDB to be healthy
if (-not $mariadbHealthy) {
    Write-Host ""
    Write-Host "Waiting for MariaDB to become healthy (first startup may take 2-3 minutes)..." -ForegroundColor Yellow
    
    $ready = $false
    $maxAttempts = 180  # 3 minutes
    for ($i = 1; $i -le $maxAttempts; $i++) {
        $health = docker inspect botak-mariadb --format='{{.State.Health.Status}}' 2>$null
        
        if ($health -eq 'healthy') {
            Write-Host "✓ MariaDB is healthy!" -ForegroundColor Green
            $ready = $true
            break
        }
        
        # Show progress every 15 seconds
        if ($i % 15 -eq 0 -or $i -eq 1) {
            Write-Host "Waiting... (Attempt $i/$maxAttempts, status: $health)" -ForegroundColor Gray
            
            # Check if container is even running
            $running = docker inspect botak-mariadb --format='{{.State.Running}}' 2>$null
            if ($running -ne 'true') {
                Write-Host "WARNING: MariaDB container is not running!" -ForegroundColor Yellow
                Write-Host "Checking logs..." -ForegroundColor Yellow
                docker logs --tail 10 botak-mariadb 2>$null | Write-Host
                Write-Host "Will retry..." -ForegroundColor Yellow
            }
        }
        Start-Sleep -Seconds 1
    }
    
    if (-not $ready) {
        Write-Host ""
        Write-Host "ERROR: MariaDB failed to become healthy after 60 seconds" -ForegroundColor Red
        Write-Host ""
        
        # Show detailed diagnostics
        Write-Host "====================================================" -ForegroundColor Yellow
        Write-Host "Diagnostic Information:" -ForegroundColor Yellow
        Write-Host "====================================================" -ForegroundColor Yellow
        
        $health = docker inspect botak-mariadb --format='{{.State.Health.Status}}' 2>$null
        Write-Host "MariaDB Health Status: $health" -ForegroundColor Cyan
        
        Write-Host ""
        Write-Host "Container Status:" -ForegroundColor Cyan
        docker ps -a 2>$null | findstr "botak-mariadb\|botak-backend"
        
        Write-Host ""
        Write-Host "Recent MariaDB Logs:" -ForegroundColor Cyan
        Write-Host "---" -ForegroundColor Gray
        docker logs --tail 20 botak-mariadb 2>$null
        Write-Host "---" -ForegroundColor Gray
        
        Write-Host ""
        Write-Host "Possible Solutions:" -ForegroundColor Yellow
        Write-Host "1. Check available disk space: docker system df"
        Write-Host "2. Verify Docker Desktop resources (Memory, CPU, Disk)"
        Write-Host "3. Try cleaning up old containers: docker-compose down && docker system prune -a"
        Write-Host "4. Check .env file has correct credentials"
        Write-Host "5. Increase Docker's allocated memory (at least 4GB recommended)"
        Write-Host ""
        
        $retry = Read-Host "Do you want to retry? (y/n)"
        if ($retry.ToLower() -eq 'y') {
            Write-Host ""
            Write-Host "Cleaning up and restarting..." -ForegroundColor Yellow
            docker-compose down
            docker-compose up -d mariadb backend
            Write-Host "Containers restarted. Please run this script again in 30 seconds."
            Read-Host "Press Enter to exit"
        }
        exit 1
    }
}

# Wait for Backend to be running
Write-Host ""
Write-Host "Waiting for Backend API to start..." -ForegroundColor Yellow

$backendRunning = $false
for ($i = 1; $i -le 30; $i++) {
    $backendState = docker inspect botak-backend --format='{{.State.Running}}' 2>$null
    
    if ($backendState -eq 'true') {
        Write-Host "✓ Backend API is running" -ForegroundColor Green
        $backendRunning = $true
        break
    }
    
    if ($i -le 10 -or $i % 5 -eq 0) {
        Write-Host "Waiting for backend... (Attempt $i/30)" -ForegroundColor Gray
    }
    Start-Sleep -Seconds 1
}

if (-not $backendRunning) {
    Write-Host "WARNING: Backend did not start in time. Check logs: docker logs botak-backend" -ForegroundColor Yellow
}

# Initialize database tables if needed
Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Initializing Database Schema" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Running database migration script..." -ForegroundColor Yellow
docker exec botak-backend node scripts/migrate.js

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "WARNING: Database migration may have failed" -ForegroundColor Yellow
    Write-Host "Check the logs above for details" -ForegroundColor Yellow
    Write-Host "Attempting to continue anyway..." -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "✓ Database schema is ready" -ForegroundColor Green
    Write-Host ""
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Installing Frontend Dependencies" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Install npm dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm packages..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: npm install failed" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "✓ npm packages already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Starting Frontend Development Server" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend URL: http://localhost:5173" -ForegroundColor Green
Write-Host "Backend API: http://localhost:3001/api" -ForegroundColor Green
Write-Host "MariaDB: localhost:3306" -ForegroundColor Green
Write-Host "LM Studio API: http://localhost:1234" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the development server" -ForegroundColor Yellow
Write-Host ""

# Start the development server
npm run dev

Read-Host "Press Enter to exit"
