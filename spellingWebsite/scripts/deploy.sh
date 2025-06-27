#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful! The dist folder is ready for deployment."
    echo "For GitHub Pages, the site will be available at: https://getOffIt.github.io/spellingWebsite/"
else
    echo "Build failed!"
    exit 1
fi 