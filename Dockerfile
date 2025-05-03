# Use Node LTS base
FROM node:lts-slim

# Set working directory

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . /student-entry-frontend/.
WORKDIR /student-entry-frontend
RUN chmod +x wait-for-it.sh

# Expose backend port
EXPOSE 3001:3001

# Start the server
# CMD ["node", "server.js","npm", "start"]
CMD ["sh", "-c", "./wait-for-it.sh mysql:3306 -- sh -c 'node server.js & npm start'"]


