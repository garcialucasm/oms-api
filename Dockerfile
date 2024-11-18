# Use Node.js as the base image
FROM node:22-alpine AS node

# Set the working directory inside the container
WORKDIR /src

# Copy the package.json and yarn.lock for dependency installation
COPY package.json yarn.lock ./

# Install production dependencies only
RUN yarn install --production

# Copy the rest of the application code into the container
COPY . .

# Expose the port your Express app listens on
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]
