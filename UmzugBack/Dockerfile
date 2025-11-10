FROM maven:3.8.4-openjdk-17 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean install -DskipTests

FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

COPY --from=build /app/target/sip-0.0.1-SNAPSHOT.jar .

EXPOSE 82

ENV SPRING_PROFILES_ACTIVE=docker

CMD ["java", "-jar", "sip-0.0.1-SNAPSHOT.jar"]




