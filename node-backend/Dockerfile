# Create image based on the official Node 6 image from the dockerhub
FROM node:latest

WORKDIR /backend/td
# Copy dependency definitions
COPY package.json /backend/td
# Install dependecies
RUN npm install
# Get all the code needed to run the app
COPY . .
# Expose the port the app runs in
EXPOSE 5010
# Serve the app
CMD ["npm", "start"]