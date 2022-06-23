# This is a comment Lab5 content
# A text file that will define all of the Docker instructions nesary for Docker Engine 

FROM node:16.15.0

LABEL maintainer="David Zhu <dzhu34@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json /app/

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src to /app/src/
COPY ./src ./src

# Start the container by running our server
CMD ["npm", "start"]

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# We run our service on port 8080
EXPOSE 8080

