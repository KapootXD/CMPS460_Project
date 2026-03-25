FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose Express server port
EXPOSE 5000

# Start with file watching for dev
CMD ["npm", "run", "dev"]
