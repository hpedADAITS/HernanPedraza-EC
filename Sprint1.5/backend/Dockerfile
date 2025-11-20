FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application
COPY . .

# Expose port
EXPOSE 3001

# Run migrations and start server
CMD ["sh", "-c", "npm run migrate && npm start"]
