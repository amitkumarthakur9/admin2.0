#!/bin/sh

service ssh start

service nginx start

# Start the PM2 process for serving the web app
pm2-runtime start npx --name "serve" -- serve dist -s -p 3000 -i max

# Keep the container running
# pm2 logs
