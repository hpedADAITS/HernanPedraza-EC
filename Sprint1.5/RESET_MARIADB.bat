@echo off
REM ================================================================
REM  MariaDB Container Reset Script (For Debug/Development)
REM ================================================================

echo.
echo ====================================================
echo MariaDB Container Reset Utility
echo ====================================================
echo.

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

REM Check if MariaDB container exists
echo Checking for MariaDB container...
docker ps -a --format "{{.Names}}" | findstr "botak-mariadb" > nul 2>&1

if %errorlevel% neq 0 (
    echo [INFO] MariaDB container does not exist
    pause
    exit /b 0
)

echo [OK] MariaDB container found
echo.
echo ====================================================
echo WARNING: This will delete the MariaDB container
echo ====================================================
echo.

REM Check if container is running
docker ps --format "{{.Names}}" | findstr "botak-mariadb" > nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Container is currently RUNNING
) else (
    echo [INFO] Container is currently STOPPED
)

echo.
echo Options:
echo 1. Delete container only (keep data volume)
echo 2. Delete container AND data volume (WARNING: PERMANENT!)
echo 3. Cancel
echo.

set /p CHOICE="Select option (1-3): "

if "%CHOICE%"=="1" (
    echo.
    echo Stopping MariaDB container...
    docker stop botak-mariadb 2>nul
    
    echo Removing MariaDB container...
    docker rm botak-mariadb
    
    if %errorlevel% equ 0 (
        echo [OK] MariaDB container removed successfully
        echo Data volume preserved: sprint15_mariadb_data
    ) else (
        echo ERROR: Failed to remove container
        pause
        exit /b 1
    )
)

if "%CHOICE%"=="2" (
    echo.
    echo ====================================================
    echo CAUTION: This will DELETE all MariaDB data
    echo ====================================================
    echo.
    
    set /p CONFIRM="Type 'DELETE' to confirm: "
    
    if /i "%CONFIRM%"=="DELETE" (
        echo.
        echo Stopping MariaDB container...
        docker stop botak-mariadb 2>nul
        
        echo Removing MariaDB container...
        docker rm botak-mariadb 2>nul
        
        echo Removing data volume...
        docker volume rm sprint15_mariadb_data 2>nul
        
        if %errorlevel% equ 0 (
            echo [OK] MariaDB container and volume removed
            echo Database will be re-initialized on next startup
        ) else (
            echo [WARN] Some files may not have been removed
            echo You can try: docker volume prune -a
        )
    ) else (
        echo Cancelled - no changes made
    )
)

if "%CHOICE%"=="3" (
    echo Cancelled - no changes made
    pause
    exit /b 0
)

if "%CHOICE%"=="" (
    echo Invalid choice
    pause
    exit /b 1
)

echo.
echo ====================================================
echo Next steps:
echo ====================================================
echo 1. Run the startup script: RUN_APP.bat
echo    (It will recreate and initialize MariaDB)
echo.
echo 2. Or manually restart:
echo    docker-compose up -d mariadb
echo.

pause
