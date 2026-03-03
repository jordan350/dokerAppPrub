# Paso 1: Construcción (Build)
FROM node:18-alpine as build-step
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Paso 2: Servidor Web (Nginx)
FROM nginx:alpine
# OJO: ruta coincida con el /dist
COPY --from=build-step /app/dist/mi-app-web /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]