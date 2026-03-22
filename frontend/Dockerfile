# Stage 1: Build the React app
FROM node:22-alpine AS build

# working directory inside the container
WORKDIR /app

# copies package.json and package-lock.json and uses Docker layer caching
COPY package.json package-lock.json* ./
RUN npm ci

# copies rest of application code
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
# lightweight nginx image
FROM nginx:alpine

# copy the built files from the 'build' stage on nginx's web directory
# default nginx web directory is typically /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# expose port 80, default HTTP port for nginx
EXPOSE 80

# command to run nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
