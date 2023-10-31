#!/bin/sh

service nginx start

# Start the PM2 process for serving the web app
pm2-runtime start npx --name "serve" -- serve dist -s

# Keep the container running
# pm2 logs
