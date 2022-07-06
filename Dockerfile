# This is a comment Lab6 content
# A text file that will define all of the Docker instructions nesary for Docker Engine 


# Stage 0: install node + install +  dependencies
FROM node:16.15.0@sha256:59eb4e9d6a344ae1161e7d6d8af831cb50713cc631889a5a8c2d438d6ec6aa0f AS dependencies

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

# node env
ENV NODE_ENV=production

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package.json package-lock.json ./

# Install node dependencies defined in package-lock.json
RUN npm ci --only=production


############################################################
# Stage 1: Use dependencies to start the site
FROM node:16.15.0@sha256:59eb4e9d6a344ae1161e7d6d8af831cb50713cc631889a5a8c2d438d6ec6aa0f

WORKDIR /app

COPY --chown=node:node --from=dependencies /app/node_modules /app/node_modules

COPY package.json package-lock.json ./

COPY ./src ./src

# Start the container by running our server
CMD ["node", "src/index"]

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# We run our service on port 8080
EXPOSE 8080

