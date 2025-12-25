FROM python:3.11.9-slim

WORKDIR /app

# Installer uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy the dependency files
COPY server/pyproject.toml ./

# Install dependencies system-wide using uv
RUN uv pip install --system --no-cache -e .

# Copy the application code
COPY server/ ./server/

# Command to start the application
CMD uvicorn server.main:app --host 0.0.0.0 --port ${SERVER_INTERNAL_PORT} --reload