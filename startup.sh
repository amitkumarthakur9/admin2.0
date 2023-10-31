#!/bin/sh

service ssh start

service nginx start

# Start the PM2 process for serving the web app
pm2-runtime start 'config/ecosystem.config.js'

# Keep the container running
# pm2 logs
