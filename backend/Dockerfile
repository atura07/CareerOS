# ─── Stage 1 : Build ───────────────────────────────────────────────
# Maven image with Java 17 for compiling and packaging the Spring Boot app.
FROM maven:3.9-eclipse-temurin-17 AS build

# Working directory for the build.
WORKDIR /build

# Copy pom.xml first to cache dependency resolution across builds.
COPY pom.xml .
# Resolve dependencies ahead of time (layer caching optimization).
RUN mvn dependency:go-offline -B

# Copy the source code and build the jar.
COPY src ./src
RUN mvn clean package -DskipTests -B

# ─── Stage 2 : Runtime ─────────────────────────────────────────────
# Slim Java 17 JRE image for running the application.
FROM eclipse-temurin:17-jre AS runtime

# Create a non-root user to run the application securely.
RUN useradd --system --home /app --shell /sbin/nologin appuser

WORKDIR /app

# Copy only the built jar from the build stage (no Maven, no source).
COPY --from=build /build/target/careeros-backend-0.0.1-SNAPSHOT.jar /app/careeros-backend.jar

# Give the non-root user ownership of the application.
RUN chown -R appuser:appuser /app

# Switch to the non-root user.
USER appuser

# Port exposed by the Spring Boot app.
EXPOSE 8080

# Run the Spring Boot jar.
ENTRYPOINT ["java", "-jar", "/app/careeros-backend.jar"]

