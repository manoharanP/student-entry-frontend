# Use Node LTS base
FROM node:latest

# Set working directory
WORKDIR /STUDENTAPP

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Expose backend port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
