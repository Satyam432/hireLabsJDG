# Use official Node.js image as base image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files to container
COPY . .

# Expose port the app will run on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
