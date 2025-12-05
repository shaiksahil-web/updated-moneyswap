# ----------- Build Stage -------------
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy all frontend source code including .env
COPY . .

# Build React app (reads .env automatically)
RUN npm run build

# ----------- Serve Stage -------------
FROM nginx:1.27-alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
