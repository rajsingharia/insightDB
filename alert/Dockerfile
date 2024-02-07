FROM node:latest

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Copy .env file to the working directory (adjust as needed)
COPY .env .env

# Generate Prisma Client (using dotenv to load environment variables)
RUN npx prisma generate

# Copy entrypoint script
COPY entrypoint.sh .

# Make the entrypoint script executable
RUN chmod +x entrypoint.sh

# Expose the application port
EXPOSE 3002

# Specify the entrypoint script
ENTRYPOINT ["./entrypoint.sh"]
