## How to use:
The Quantum Discovery Simulator includes a Docker setup that demonstrates that the application can run in a containerized environment.

The provided docker-compose.yml is intended for runtime demonstration only, **not for development**. This might change in the future.
For local development, the frontend and backend should be started directly (npm run dev etc.) to enable faster iteration and hot reload.

````bash
mvn clean package #Only if you changed backend dependencies
````
Then: (This will take a while at the first..)
````bash
docker compose up --build
````
App is reachable via:
Frontend: http://localhost:3000
Backend API: http://localhost:8080

To end the app:
````bash
docker compose down
````

For devs: