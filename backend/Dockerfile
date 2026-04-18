# Use Eclipse Temurin as the base image
FROM eclipse-temurin:25

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file into the container
COPY target/Group_12QuantumSim-1.0-SNAPSHOT.jar app.jar

# Expose the port that the application will run on
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
