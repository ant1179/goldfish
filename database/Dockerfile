FROM postgres:17

# Set the working directory
WORKDIR /var/lib/postgresql

# Create a non root user with customizable UID/GID
ARG UID=1000
ARG GID=1000

# Modify postgres user and group to use custom UID/GID (postgres user is already non-root)
RUN groupmod --gid "${GID}" postgres \
    && usermod --uid "${UID}" --gid "${GID}" postgres \
    && chown postgres:postgres -R /var/lib/postgresql \
    && chown postgres:postgres -R /var/run/postgresql \
    && chown postgres:postgres -R /docker-entrypoint-initdb.d

# Copy initialization script
COPY init.sql /docker-entrypoint-initdb.d/init.sql
RUN chown postgres:postgres /docker-entrypoint-initdb.d/init.sql

# Set the user to run PostgreSQL (postgres user is non-root)
USER postgres

# Command to start PostgreSQL
CMD ["postgres"]

