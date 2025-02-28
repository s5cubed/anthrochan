#!/bin/bash

# Determine environment
env="development"
if [ "$1" == "prod" ]; then
    env="production"
fi

# Stop the PM2 process
pm2 stop ecosystem.config.js

# Run Gulp task
gulp

# Restart the PM2 process with the selected environment
pm2 restart ecosystem.config.js --env $env

# Print success message
echo "Commands executed successfully in $env environment."