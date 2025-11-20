@echo off
REM ================================================================
REM  Botak Application Startup Script with MariaDB & LM Studio
REM ================================================================

echo.
echo ====================================================
echo Starting Botak Application Stack
echo ====================================================
echo.

echo Bootstrapping LM Studio so this auto deployment works
cmd /c %USERPROFILE%/.lmstudio/bin/lms.exe bootstrap

REM Check if Docker is running
echo Checking Docker status...
docker ps > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and run this script again.
    pause
    exit /b 1
)

echo [OK] Docker is running
echo.

REM Check if lms CLI is available
echo Checking for LM Studio CLI (lms)...
where lms > nul 2>&1

if %errorlevel% neq 0 (
    echo ERROR: LM Studio CLI (lms) is not installed or not in PATH
    echo.
    echo Please ensure LM Studio is installed with CLI support:
    echo 1. Download LM Studio from: https://lmstudio.ai/
    echo 2. Install using the default installer
    echo 3. Enable CLI in LM Studio settings: Settings ^> Advanced ^> Enable CLI
    echo 4. The 'lms' command should be available in your PATH
    echo.
    echo To verify installation, run: lms --version
    echo.
    pause
    exit /b 1
)

echo [OK] LM Studio CLI found
echo.

REM Check if LM Studio server is running on port 1234
echo Checking LM Studio API server...

powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:1234/v1/models' -Method GET -ErrorAction SilentlyContinue -TimeoutSec 2; if ($response.StatusCode -eq 200) { exit 0 } } catch { exit 1 }" > nul 2>&1

if %errorlevel% equ 0 (
    echo [OK] LM Studio server is already running on port 1234
) else (
    echo LM Studio server not detected on port 1234
    echo Starting LM Studio server...

    REM Start LM Studio server in background
    start "" lms server start

    echo [OK] LM Studio server started
    echo.
    echo Waiting for LM Studio server to be ready (this may take up to 30 seconds)...

    set LM_READY=0
    for /l %%i in (1,1,30) do (
        powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:1234/v1/models' -Method GET -ErrorAction SilentlyContinue -TimeoutSec 2; if ($response.StatusCode -eq 200) { exit 0 } } catch { exit 1 }" > nul 2>&1

        if %errorlevel% equ 0 (
            echo [OK] LM Studio server is ready!
            set LM_READY=1
            goto lm_ready
        )

        if %%i equ 30 (
            echo Attempt %%i/30...
        ) else if %%i geq 5 (
            if not %%i mod 5 equ 0 goto skip_lm_log
            echo Attempt %%i/30...
            :skip_lm_log
        ) else (
            echo Attempt %%i/30...
        )
        timeout /t 1 > nul
    )

    if %LM_READY% equ 0 (
        echo [WARN] LM Studio server may not be fully ready, but continuing...
        echo If the app fails to connect, run: lms server start
    )
)

:lm_ready

echo.

REM Check if MariaDB image exists
echo Checking for MariaDB Docker image...
docker images --format "table {{.Repository}}:{{.Tag}}" 2>nul | findstr "mariadb:latest" > nul 2>&1

if %errorlevel% neq 0 (
    echo MariaDB image not found. Pulling from Docker Hub...
    echo This may take a few minutes...

    docker pull mariadb:latest

    if %errorlevel% neq 0 (
        echo ERROR: Failed to pull MariaDB image
        echo Check your internet connection and try again.
        pause
        exit /b 1
    )

    echo [OK] MariaDB image pulled successfully
) else (
    echo [OK] MariaDB image found
)

echo.

REM Check if MariaDB is already running
echo Checking for existing containers...
for /f %%i in ('docker ps --format "{{.Names}}" 2^>nul ^| findstr "botak-mariadb"') do set MARIADB_RUNNING=%%i

if defined MARIADB_RUNNING (
    echo [OK] MariaDB is already running
) else (
    echo Starting MariaDB and Backend containers...
    docker-compose down >nul 2>&1
    docker-compose up -d mariadb backend
)

REM Wait for MariaDB to be healthy
echo.
echo Waiting for MariaDB to become healthy (first startup may take 2-3 minutes)...

set MARIADB_READY=0
for /l %%i in (1,1,180) do (
    for /f %%h in ('docker inspect botak-mariadb --format^="{{.State.Health.Status}}" 2^>nul') do (
        if "%%h"=="healthy" (
            echo [OK] MariaDB is healthy!
            set MARIADB_READY=1
            goto mariadb_ready
        )
    )
    
    REM Show progress every 15 seconds
    if %%i equ 1 goto show_progress
    if not %%i mod 15 equ 0 goto skip_progress
    
    :show_progress
    for /f %%r in ('docker inspect botak-mariadb --format^="{{.State.Running}}" 2^>nul') do (
        if not "%%r"=="true" (
            echo [WARN] Container not running, checking logs...
            docker logs --tail 10 botak-mariadb 2>nul
            echo Will retry...
        )
    )
    echo Attempt %%i/180...
    
    :skip_progress
    timeout /t 1 > nul
)

if %MARIADB_READY% equ 0 (
    echo.
    echo ERROR: MariaDB failed to become healthy after 3 minutes
    echo.
    echo ====================================================
    echo Diagnostic Information:
    echo ====================================================

    echo.
    echo Container Status:
    docker ps -a 2>nul | findstr "botak-mariadb botak-backend"

    echo.
    echo Recent MariaDB Logs:
    echo ---
    docker logs --tail 20 botak-mariadb 2>nul
    echo ---

    echo.
    echo Possible Solutions:
    echo 1. Check available disk space: docker system df
    echo 2. Verify Docker Desktop resources (Memory, CPU, Disk)
    echo 3. Try cleaning up old containers: docker-compose down ^&^& docker system prune -a
    echo 4. Check .env file has correct credentials
    echo 5. Increase Docker's allocated memory (at least 4GB recommended)
    echo.

    set /p RETRY="Do you want to retry? (y/n): "
    if /i "%RETRY%"=="y" (
        echo.
        echo Cleaning up and restarting...
        docker-compose down
        docker-compose up -d mariadb backend
        echo Containers restarted. Please run this script again in 30 seconds.
    )
    pause
    exit /b 1
)

:mariadb_ready

REM Wait for Backend to be running
echo.
echo Waiting for Backend API to start...

set BACKEND_RUNNING=0
for /l %%i in (1,1,30) do (
    for /f %%s in ('docker inspect botak-backend --format^="{{.State.Running}}" 2^>nul') do (
        if "%%s"=="true" (
            echo [OK] Backend API is running
            set BACKEND_RUNNING=1
            goto backend_ready
        )
    )

    if %%i leq 10 (
        echo Waiting for backend... Attempt %%i/30
    ) else if not %%i mod 5 equ 0 (
        goto backend_skip
    ) else (
        echo Waiting for backend... Attempt %%i/30
    )
    :backend_skip
    timeout /t 1 > nul
)

if %BACKEND_RUNNING% equ 0 (
    echo [WARN] Backend did not start in time. Check logs: docker logs botak-backend
)

:backend_ready

REM Initialize database tables if needed
echo.
echo ====================================================
echo Initializing Database Schema
echo ====================================================
echo.

echo Running database migration script...
docker exec botak-backend node scripts/migrate.js

if %errorlevel% neq 0 (
    echo.
    echo [WARN] Database migration may have failed
    echo Check the logs above for details
    echo Attempting to continue anyway...
    echo.
) else (
    echo [OK] Database schema is ready
    echo.
)

echo.
echo ====================================================
echo Installing Frontend Dependencies
echo ====================================================
echo.

REM Install npm dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: npm install failed
        pause
        exit /b 1
    )
) else (
    echo [OK] npm packages already installed
)

echo.
echo ====================================================
echo Starting Frontend Development Server
echo ====================================================
echo.
echo Frontend URL: http://localhost:5173
echo Backend API: http://localhost:3001/api
echo MariaDB: localhost:3306
echo LM Studio API: http://localhost:1234
echo.
echo Press Ctrl+C to stop the development server
echo.

REM Start the development server
call npm run dev

pause
