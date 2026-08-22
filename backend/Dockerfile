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
# Java 17 JRE image for running the application.
FROM eclipse-temurin:17-jre AS runtime

# Install production Tesseract OCR engine and English language pack
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-eng \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user to run the application securely.
RUN useradd --system --home /app --shell /sbin/nologin appuser

WORKDIR /app

# Pre-create the uploads directory and copy the jar
RUN mkdir -p /app/uploads

# Copy only the built jar from the build stage (no Maven, no source).
COPY --from=build /build/target/careeros-backend-0.0.1-SNAPSHOT.jar /app/careeros-backend.jar

# Give the non-root user ownership of the application and uploads.
RUN chown -R appuser:appuser /app

# Switch to the non-root user.
USER appuser

# Port exposed by the Spring Boot app.
EXPOSE 8080

# Run the Spring Boot jar with container performance optimization and entropy flags
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "/app/careeros-backend.jar"]
