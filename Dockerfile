# Use the official Node.js runtime (latest version) as the base image
FROM node:20

RUN apt-get update && apt-get install -y nginx && apt-get install -y nginx-extras

RUN rm /etc/nginx/sites-enabled/default
RUN rm /etc/nginx/nginx.conf

COPY site.conf /etc/nginx/sites-enabled/
COPY nginx.conf /etc/nginx/
COPY server-errors/custom40x.html /usr/share/nginx/html/
COPY server-errors/custom50x.html /usr/share/nginx/html/

# Create and set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY . .

# Install the project dependencies
RUN npm install

# Run the Expo export command to build the web app
RUN npx expo export -p web

# Install PM2 globally
RUN npm install -g pm2

# Expose the port on which the web app will run
EXPOSE 80

# Create a startup script for PM2
COPY startup.sh /app/startup.sh
RUN chmod +x /app/startup.sh

# Start the application with PM2
CMD ["./startup.sh"]
