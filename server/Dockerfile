# Use an official Node runtime as base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install
RUN ls -al -R

# Bundle the source code
COPY . .

# Expose the port the app listens on
EXPOSE 3001

# Run the application
CMD ["npm", "start"]
