FROM python:3.11.9-slim 

# Set global options
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy
# Omit dev dependencies
ENV UV_NO_DEV=1 
# Only use the managed Python version
ENV UV_PYTHON_PREFERENCE=only-managed

# The installer requires curl (and certificates) to download the release archive
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates

# Set the working directory
WORKDIR /app

# Create a non root user
ARG UID=1000
ARG GID=1000

RUN groupadd --gid "${GID}" appuser \
    && useradd --home /home/appuser --uid "${UID}" --gid "${GID}" appuser \
    && chown appuser:appuser -R /app

# Installer uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Install project dependencies
COPY requirements.txt .
RUN uv pip install --system -r requirements.txt

# Copy project files
COPY . .

# Set the user to run the application
USER appuser

# Command to start the application
CMD uvicorn main:app --host 0.0.0.0 --port ${SERVER_INTERNAL_PORT} --reload