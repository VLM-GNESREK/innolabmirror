## How to use:
Start this project with Docker! Docker must be installed.

````bash
mvn clean package
````
Then: (This will take a while at the first..)
````bash
docker compose up --build
````
Start the App using ```npm run dev``` and access the app via http://localhost:3000

To end the app:
````bash
docker compose down
````
