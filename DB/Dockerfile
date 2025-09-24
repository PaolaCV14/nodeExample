# Use the official MariaDB image as the base image
FROM mariadb:latest

# Copy custom initialization scripts into the container
# These scripts will run automatically when the container starts
COPY ./DB/initdb.d /docker-entrypoint-initdb.d

# Install mysql-client to get mysqladmin
RUN apt-get update && apt-get install -y mariadb-client

# Optional: Set environment variables
ENV MYSQL_ROOT_PASSWORD=my-secret-pw
ENV MYSQL_DATABASE=mydatabase

# Expose the default MariaDB port
EXPOSE 3306
