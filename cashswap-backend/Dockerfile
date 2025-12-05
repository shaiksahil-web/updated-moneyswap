FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy source
COPY . .

# Environment variables
ENV PORT=4000
EXPOSE 4000

CMD ["node", "server.js"]
