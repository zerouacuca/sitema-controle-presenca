# Stage 1: Construir a aplicação com Maven
FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /app

# Copiar o wrapper do Maven e o pom.xml
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Baixar dependências (para aproveitar o cache do Docker)
RUN ./mvnw dependency:go-offline

# Copiar o código-fonte e construir o projeto
COPY src ./src
RUN ./mvnw package -DskipTests

# Stage 2: Criar a imagem final e leve
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copiar o JAR construído da stage anterior
COPY --from=builder /app/target/Pontu.jar app.jar

# A porta padrão do Spring Boot é 8080 (agora que removemos o SSL)
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]