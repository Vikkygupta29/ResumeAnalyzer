# Step 1: Use Node 20 Alpine to build the app
FROM node:20-alpine AS build
WORKDIR /app

# Take the API Key and write it to .env.local
ARG GEMINI_API_KEY
RUN echo "VITE_GEMINI_API_KEY=$GEMINI_API_KEY" > .env.local

# Install dependencies and build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Use Nginx Alpine to serve the build
FROM nginx:alpine
# Copy our custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the built files from the 'build' stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
