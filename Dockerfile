# Paso 1: Build Angular (Angular 21 requiere Node >= 20.19)
FROM node:20.19-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Paso 2: Servir estático con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/dokerAppPrub/browser/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]