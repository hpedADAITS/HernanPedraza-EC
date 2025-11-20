#!/bin/bash

# ================================================================
#  Botak Application Startup Script with MariaDB & LM Studio
# ================================================================

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}====================================================${NC}"
echo -e "${CYAN}Starting Botak Application Stack${NC}"
echo -e "${CYAN}====================================================${NC}"
echo ""

# Check if Docker is running
echo -e "${YELLOW}Checking Docker status...${NC}"

if ! docker ps > /dev/null 2>&1; then
    echo -e "${RED}ERROR: Docker is not running!${NC}"
    echo "Please start Docker and run this script again."
    exit 1
fi

echo -e "${GREEN}✓ Docker is running${NC}"
echo ""

echo -e "${YELLOW}Bootstrapping LMS to load model...${NC}"
~/.lmstudio/bin/lms bootstrap

# Check if lms CLI is available
echo -e "${YELLOW}Checking for LM Studio CLI (lms)...${NC}"

if ! command -v lms &> /dev/null; then
    echo -e "${RED}ERROR: LM Studio CLI (lms) is not installed or not in PATH${NC}"
    echo ""
    echo -e "${CYAN}Please ensure LM Studio is installed with CLI support:${NC}"
    echo "1. Download LM Studio from: https://lmstudio.ai/"
    echo "2. Install using the default installer"
    echo "3. Enable CLI in LM Studio settings: Settings > Advanced > Enable CLI"
    echo "4. The 'lms' command should be available in your PATH"
    echo ""
    echo -e "${CYAN}To verify installation, run: lms --version${NC}"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ LM Studio CLI found${NC}"
echo ""

# Check if LM Studio server is running on port 1234
echo -e "${YELLOW}Checking LM Studio API server...${NC}"

lmStudioRunning=0
if curl -s http://localhost:1234/v1/models > /dev/null 2>&1; then
    echo -e "${GREEN}✓ LM Studio server is already running on port 1234${NC}"
    lmStudioRunning=1

    # Check if a model is loaded
    if command -v jq &> /dev/null; then
        models=$(curl -s http://localhost:1234/v1/models | jq -r '.data[0].id' 2>/dev/null)
        if [ -n "$models" ] && [ "$models" != "null" ]; then
            echo -e "${GREEN}✓ Loaded model: $models${NC}"
        fi
    fi
else
    echo -e "${YELLOW}LM Studio server not detected on port 1234${NC}"
    echo -e "${YELLOW}Starting LM Studio server...${NC}"

    # Start LM Studio server in background
    lms server start > /tmp/lm-studio.log 2>&1 &
    LM_STUDIO_PID=$!
    echo -e "${GREEN}LM Studio server started (PID: $LM_STUDIO_PID)${NC}"

    echo ""
    echo -e "${YELLOW}Waiting for LM Studio server to be ready (this may take up to 30 seconds)...${NC}"

    ready=0
    for i in $(seq 1 30); do
        if curl -s http://localhost:1234/v1/models > /dev/null 2>&1; then
            echo -e "${GREEN}✓ LM Studio server is ready!${NC}"

            # Check for loaded models
            if command -v jq &> /dev/null; then
                models=$(curl -s http://localhost:1234/v1/models | jq -r '.data[0].id' 2>/dev/null)
                if [ -n "$models" ] && [ "$models" != "null" ]; then
                    echo -e "${GREEN}✓ Loaded model: $models${NC}"
                else
                    echo -e "${YELLOW}⚠ Warning: No models are currently loaded${NC}"
                    echo -e "${YELLOW}Please load a model in LM Studio before using the chatbot${NC}"
                fi
            fi

            ready=1
            break
        fi

        if [ $((i % 5)) -eq 0 ] || [ "$i" -eq 30 ]; then
            echo -e "${YELLOW}Waiting... (Attempt $i/30)${NC}"
        fi

        sleep 1
    done

    if [ "$ready" -eq 0 ]; then
        echo -e "${YELLOW}WARNING: LM Studio server may not be fully ready, but continuing...${NC}"
        echo -e "${YELLOW}If the app fails to connect, run: lms server start${NC}"
    fi
fi

echo ""

# Check if MariaDB image exists
echo -e "${YELLOW}Checking for MariaDB Docker image...${NC}"

if ! docker images --format "{{.Repository}}:{{.Tag}}" 2>/dev/null | grep -q "^mariadb:latest$"; then
    echo -e "${YELLOW}MariaDB image not found. Pulling from Docker Hub...${NC}"
    echo -e "${YELLOW}This may take a few minutes...${NC}"

    if ! docker pull mariadb:latest; then
        echo -e "${RED}ERROR: Failed to pull MariaDB image${NC}"
        echo "Check your internet connection and try again."
        exit 1
    fi

    echo -e "${GREEN}✓ MariaDB image pulled successfully${NC}"
else
    echo -e "${GREEN}✓ MariaDB image found${NC}"
fi

echo ""

# Check if MariaDB is already running
echo -e "${YELLOW}Checking for existing containers...${NC}"

MARIADB_RUNNING=$(docker ps 2>/dev/null | grep -c "botak-mariadb" || true)
MARIADB_HEALTHY=0

if [ "$MARIADB_RUNNING" -eq 1 ]; then
    HEALTH=$(docker inspect botak-mariadb --format='{{.State.Health.Status}}' 2>/dev/null || echo "unknown")
    if [ "$HEALTH" = "healthy" ]; then
        echo -e "${GREEN}✓ MariaDB is already running and healthy${NC}"
        MARIADB_HEALTHY=1
    else
        echo -e "${YELLOW}⚠ MariaDB is running but not healthy yet. Waiting...${NC}"
    fi
else
    echo -e "${YELLOW}Starting MariaDB and Backend containers...${NC}"
    docker-compose down 2>/dev/null || true
    docker-compose up -d mariadb backend
fi

# Wait for MariaDB to be healthy
if [ "$MARIADB_HEALTHY" -eq 0 ]; then
    echo ""
    echo -e "${YELLOW}Waiting for MariaDB to become healthy (first startup may take 2-3 minutes)...${NC}"

    READY=0
    for i in $(seq 1 180); do
        HEALTH=$(docker inspect botak-mariadb --format='{{.State.Health.Status}}' 2>/dev/null || echo "starting")

        if [ "$HEALTH" = "healthy" ]; then
            echo -e "${GREEN}✓ MariaDB is healthy!${NC}"
            READY=1
            break
        fi

        # Show progress every 15 seconds or on first attempt
        if [ $((i % 15)) -eq 0 ] || [ "$i" -eq 1 ]; then
            echo -e "${YELLOW}Waiting... (Attempt $i/180, status: $HEALTH)${NC}"

            # Check if container is even running
            RUNNING=$(docker inspect botak-mariadb --format='{{.State.Running}}' 2>/dev/null || echo "false")
            if [ "$RUNNING" != "true" ]; then
                echo -e "${YELLOW}⚠ Container not running, checking logs...${NC}"
                docker logs --tail 10 botak-mariadb 2>/dev/null
                echo -e "${YELLOW}Will retry...${NC}"
            fi
        fi

        sleep 1
    done

    if [ "$READY" -eq 0 ]; then
        echo ""
        echo -e "${RED}ERROR: MariaDB failed to become healthy after 3 minutes${NC}"
        echo ""

        # Show detailed diagnostics
        echo -e "${CYAN}====================================================${NC}"
        echo -e "${CYAN}Diagnostic Information:${NC}"
        echo -e "${CYAN}====================================================${NC}"
        echo ""

        HEALTH=$(docker inspect botak-mariadb --format='{{.State.Health.Status}}' 2>/dev/null || echo "unknown")
        echo -e "${CYAN}MariaDB Health Status: $HEALTH${NC}"

        echo ""
        echo -e "${CYAN}Container Status:${NC}"
        docker ps -a 2>/dev/null | grep -E "botak-mariadb|botak-backend"

        echo ""
        echo -e "${CYAN}Recent MariaDB Logs:${NC}"
        echo "---"
        docker logs --tail 20 botak-mariadb 2>/dev/null
        echo "---"

        echo ""
        echo -e "${YELLOW}Possible Solutions:${NC}"
        echo "1. Check available disk space: docker system df"
        echo "2. Verify Docker resources (Memory, CPU, Disk)"
        echo "3. Try cleaning up old containers: docker-compose down && docker system prune -a"
        echo "4. Check .env file has correct credentials"
        echo "5. Increase Docker's allocated memory (at least 4GB recommended)"
        echo "6. Check MariaDB logs above for specific errors"
        echo ""

        read -p "Do you want to retry? (y/n): " RETRY
        if [ "$RETRY" = "y" ] || [ "$RETRY" = "Y" ]; then
            echo ""
            echo -e "${YELLOW}Cleaning up and restarting...${NC}"
            docker-compose down
            docker-compose up -d mariadb backend
            echo -e "${YELLOW}Containers restarted. Please run this script again in 30 seconds.${NC}"
        fi
        exit 1
    fi
fi

# Wait for Backend to be running
echo ""
echo -e "${YELLOW}Waiting for Backend API to start...${NC}"

BACKEND_READY=0
for i in $(seq 1 30); do
    RUNNING=$(docker inspect botak-backend --format='{{.State.Running}}' 2>/dev/null || echo "false")

    if [ "$RUNNING" = "true" ]; then
        echo -e "${GREEN}✓ Backend API is running${NC}"
        BACKEND_READY=1
        break
    fi

    if [ "$i" -le 10 ] || [ $((i % 5)) -eq 0 ]; then
        echo -e "${YELLOW}Waiting for backend... (Attempt $i/30)${NC}"
    fi

    sleep 1
done

if [ "$BACKEND_READY" -eq 0 ]; then
    echo -e "${YELLOW}WARNING: Backend did not start in time. Check logs: docker logs botak-backend${NC}"
fi

# Initialize database tables if needed
echo ""
echo -e "${CYAN}====================================================${NC}"
echo -e "${CYAN}Initializing Database Schema${NC}"
echo -e "${CYAN}====================================================${NC}"
echo ""

echo -e "${YELLOW}Running database migration script...${NC}"
docker exec botak-backend node scripts/migrate.js

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${YELLOW}WARNING: Database migration may have failed${NC}"
    echo -e "${YELLOW}Check the logs above for details${NC}"
    echo -e "${YELLOW}Attempting to continue anyway...${NC}"
    echo ""
else
    echo -e "${GREEN}✓ Database schema is ready${NC}"
    echo ""
fi

echo ""
echo -e "${CYAN}====================================================${NC}"
echo -e "${CYAN}Installing Frontend Dependencies${NC}"
echo -e "${CYAN}====================================================${NC}"
echo ""

# Install npm dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing npm packages...${NC}"
    npm install

    if [ $? -ne 0 ]; then
        echo -e "${RED}ERROR: npm install failed${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ npm packages already installed${NC}"
fi

echo ""
echo -e "${CYAN}====================================================${NC}"
echo -e "${CYAN}Starting Frontend Development Server${NC}"
echo -e "${CYAN}====================================================${NC}"
echo ""
echo -e "${GREEN}Frontend URL: http://localhost:5173${NC}"
echo -e "${GREEN}Backend API: http://localhost:3001/api${NC}"
echo -e "${GREEN}MariaDB: localhost:3306${NC}"
echo -e "${GREEN}LM Studio API: http://localhost:1234${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the development server${NC}"
echo ""

# Start the development server
npm run dev
