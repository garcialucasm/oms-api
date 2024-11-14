# Build Instructions for OMS-API

This document provides a step-by-step guide to building and running the OMS API Docker container.

## Building and Running the Docker Container with Node.js and MongoDB

1. **Build the Docker Image**

   From the root of the project directory, run the following command to build the Docker image:

   """
   docker compose build -d
   """

2. **Run Docker Compose**

   """
   docker compose up -d
   """

## Building and Running Only the Node.js Docker Container

1. **Build the Docker Image**

   From the root of the project directory, run the following command to build the Docker image:

   """
   docker build -t oms-api .
   """

2. **Run the Docker Container**

   """
   docker run -d --name oms-api-container -p 3000:3000 oms-api
   """

   or

   """
   docker run -d -p 3000:3000 oms-api
   """

## Troubleshooting Common Errors

### Conflict Error: `The container name "/oms-api-container" is already in use`

If you see an error stating that `"/oms-api-container"` is already in use, this means a container with the same name already exists. You can either:

- **Remove existing containers | Docker Compose**

  """
  docker compose down
  """

- **Remove the existing container** and then re-run the container:

  """
  docker rm oms-api-container
  docker run -d --name oms-api-container -p 3000:3000 oms-api
  """

- **Run the container without specifying a name** (Docker will assign a random name):

  """
  docker run -d -p 3000:3000 oms-api
  """
