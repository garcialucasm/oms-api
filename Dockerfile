# Use Node.js as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json (or yarn.lock) for dependency installation
COPY package*.json ./

# Install dependencies (using npm or yarn based on your setup)
RUN yarn

# Copy the rest of the application code into the container
COPY . .

# Expose the port our Express app listens on
EXPOSE 3000

# Use the npm start script defined in package.json
CMD ["yarn", "start"]
