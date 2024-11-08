# Use the official Node.js runtime (latest version) as the base image
FROM node:20

ARG API_ENDPOINT
ENV API_ENDPOINT="https://vision-be.kcp.com.in/"

RUN apt-get update && apt-get install -y nginx && apt-get install -y nginx-extras

RUN rm /etc/nginx/sites-enabled/default
RUN rm /etc/nginx/nginx.conf


COPY example.crt /etc/ssl/certs/example.crt
COPY example.key /etc/ssl/private/example.key

#Permsissions on the key file
RUN chmod 600 /etc/ssl/private/example.key
RUN chmod 644 /etc/ssl/certs/example.crt


COPY site.conf /etc/nginx/sites-enabled/
COPY nginx.conf /etc/nginx/
COPY server-errors/custom40x.html /usr/share/nginx/html/
COPY server-errors/custom50x.html /usr/share/nginx/html/

# Create and set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY . .

# Install the project dependencies
RUN rm -rf .git/hooks
RUN npm install --legacy-peer-dep

# Run the Expo export command to build the web app
RUN npx expo export -p web

RUN cp -r ./assets/data ./dist/assets/

# Install PM2 globally
RUN npm install -g pm2
RUN npm install -g serve

RUN apt-get update \
    && apt-get install -y --no-install-recommends dialog \
    && apt-get install -y --no-install-recommends openssh-server \
    && echo "root:Docker!" | chpasswd \
    && apt-get install -y nano 

COPY sshd_config /etc/ssh/

RUN apt-get update && \
    apt-get install -yq tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Kolkata /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata

ENV TZ="Asia/Kolkata"

# Expose the port on which the web app will run
EXPOSE 80

# Create a startup script for PM2
COPY startup.sh /app/startup.sh
RUN chmod +x /app/startup.sh

# Start the application with PM2
CMD ["./startup.sh"]
