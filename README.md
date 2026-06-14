# Quantum Discovery Simulator

The Quantum Discovery Simulator utilises a dual Docker Compose setup to provide both a containerised development environment with hot-reloading and a packaged production environment.

## Development Environment

This configuration mounts your local source code into the containers. Changes made to the frontend or backend code will automatically trigger a reload, eliminating the need to run local package managers outside of Docker.

To start the development environment:
```bash
docker compose -f docker-compose.dev.yml up --build
```
*Note: The backend container leverages Maven volume caching, so the initial build will download dependencies, but subsequent startups will be much faster.*

## Production / Runnable Application

This configuration uses multi-stage Docker builds to compile and package the application into lightweight, immutable containers. No local code volumes are mounted, ensuring the application runs exactly as packaged.

To build and run the production application in the background:
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

## Accessing the Application

Regardless of the environment you are running, the application services are available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## Stopping the Application
To shut down the running containers, use the `down` command corresponding to your active configuration file:
```bash
# To stop the development environment:
docker compose -f docker-compose.dev.yml down

# To stop the production environment:
docker compose -f docker-compose.prod.yml down
```