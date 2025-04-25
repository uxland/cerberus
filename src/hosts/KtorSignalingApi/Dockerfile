FROM gradle:8.5-jdk23 as build
WORKDIR /app
COPY . /app/
RUN gradle buildFatJar --no-daemon

FROM openjdk:23-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar /app/application.jar
EXPOSE 8080
# Ensure java is in the PATH and use the full path to java executable
ENV PATH="/usr/local/openjdk-23/bin:${PATH}"
CMD ["/usr/local/openjdk-23/bin/java", "-jar", "/app/application.jar"]
