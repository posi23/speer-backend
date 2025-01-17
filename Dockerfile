# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the app port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]

# # Default environment is production; override with build args
# ARG NODE_ENV=production
# ENV NODE_ENV=$NODE_ENV

# # Install production dependencies only (for production builds)
# RUN if [ "$NODE_ENV" = "production" ]; then npm prune --production; fi

# # Default entrypoint based on NODE_ENV
# ENTRYPOINT [ "sh", "-c", "if [ \"$NODE_ENV\" = \"test\" ]; then npm test; else npm start; fi" ]

