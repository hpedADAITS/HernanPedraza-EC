#!/bin/bash

# ================================================================
#  MariaDB Container Reset Script (For Debug/Development)
# ================================================================

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}====================================================${NC}"
echo -e "${CYAN}MariaDB Container Reset Utility${NC}"
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

# Check if MariaDB container exists
echo -e "${YELLOW}Checking for MariaDB container...${NC}"

if ! docker ps -a --format "{{.Names}}" 2>/dev/null | grep -q "botak-mariadb"; then
    echo -e "${CYAN}ℹ MariaDB container does not exist${NC}"
    exit 0
fi

echo -e "${GREEN}✓ MariaDB container found${NC}"
echo ""

echo -e "${CYAN}====================================================${NC}"
echo -e "${RED}WARNING: This will delete the MariaDB container${NC}"
echo -e "${CYAN}====================================================${NC}"
echo ""

# Check if container is running
if docker ps --format "{{.Names}}" 2>/dev/null | grep -q "botak-mariadb"; then
    echo -e "${CYAN}ℹ Container is currently RUNNING${NC}"
else
    echo -e "${CYAN}ℹ Container is currently STOPPED${NC}"
fi

echo ""
echo -e "${YELLOW}Options:${NC}"
echo -e "${CYAN}  1. Delete container only (keep data volume)${NC}"
echo -e "${RED}  2. Delete container AND data volume (WARNING: PERMANENT!)${NC}"
echo -e "${CYAN}  3. Cancel${NC}"
echo ""

read -p "Select option (1-3): " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}Stopping MariaDB container...${NC}"
        docker stop botak-mariadb 2>/dev/null
        
        echo -e "${YELLOW}Removing MariaDB container...${NC}"
        if docker rm botak-mariadb; then
            echo -e "${GREEN}✓ MariaDB container removed successfully${NC}"
            echo -e "${CYAN}  Data volume preserved: sprint15_mariadb_data${NC}"
        else
            echo -e "${RED}ERROR: Failed to remove container${NC}"
            exit 1
        fi
        ;;
    
    2)
        echo ""
        echo -e "${CYAN}====================================================${NC}"
        echo -e "${RED}CAUTION: This will DELETE all MariaDB data${NC}"
        echo -e "${CYAN}====================================================${NC}"
        echo ""
        
        read -p "Type 'DELETE' to confirm: " confirm
        
        if [ "$confirm" = "DELETE" ]; then
            echo ""
            echo -e "${YELLOW}Stopping MariaDB container...${NC}"
            docker stop botak-mariadb 2>/dev/null
            
            echo -e "${YELLOW}Removing MariaDB container...${NC}"
            docker rm botak-mariadb 2>/dev/null
            
            echo -e "${YELLOW}Removing data volume...${NC}"
            if docker volume rm sprint15_mariadb_data 2>/dev/null; then
                echo -e "${GREEN}✓ MariaDB container and volume removed${NC}"
                echo -e "${CYAN}  Database will be re-initialized on next startup${NC}"
            else
                echo -e "${YELLOW}⚠ Some files may not have been removed${NC}"
                echo -e "${CYAN}  You can try: docker volume prune -a${NC}"
            fi
        else
            echo -e "${CYAN}Cancelled - no changes made${NC}"
        fi
        ;;
    
    3)
        echo -e "${CYAN}Cancelled - no changes made${NC}"
        exit 0
        ;;
    
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${CYAN}====================================================${NC}"
echo -e "${CYAN}Next steps:${NC}"
echo -e "${CYAN}====================================================${NC}"
echo -e "${GREEN}1. Run the startup script: ./RUN_APP.sh${NC}"
echo -e "${GREEN}   (It will recreate and initialize MariaDB)${NC}"
echo ""
echo -e "${GREEN}2. Or manually restart:${NC}"
echo -e "${GREEN}   docker-compose up -d mariadb${NC}"
echo ""
