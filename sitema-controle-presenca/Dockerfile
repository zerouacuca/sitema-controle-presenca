# Stage 1: Construir a aplicação Angular
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
# Usamos a configuração de produção, que agora usa /api-backend
RUN npm run build -- --configuration production

# Stage 2: Servir os ficheiros com Nginx
FROM nginx:alpine

# Copiar os ficheiros estáticos compilados
# (O seu 'angular.json' define o output como 'dist/sitema-controle-presenca/browser')
COPY --from=builder /app/dist/sitema-controle-presenca/browser /usr/share/nginx/html

# Copiar a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80