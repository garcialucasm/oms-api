# Build Instructions for OMS-API

This document provides a step-by-step guide for building and running the OMS API Docker container.

### Note for Windows Users 🪟

Windows users should **start Docker Desktop** before executing the commands below.

## Building and Running the Docker Container

1. **Build the Docker Image**

   From the root of the project directory, run the following command to build the Docker image:

   ```bash
   docker build -t oms-api .
   ```

2. **Run the Docker Container**

   ```bash
   docker run -d --name oms-api-container -p 3000:3000 oms-api
   ```

## Troubleshooting Common Errors

### Conflict Error: `The container name "/oms-api-container" is already in use`

If you see an error stating that `"/oms-api-container"` is already in use, this means a container with the same name already exists. You can either:

- **Remove the existing container** and then re-run the container:

  ```bash
  docker rm oms-api-container
  docker run -d --name oms-api-container -p 3000:3000 oms-api
  ```

- **Run the container without specifying a name** (Docker will assign a random name):

  ```bash
  docker run -d -p 3000:3000 oms-api
  ```
