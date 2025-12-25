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

# Installer uv
COPY --from=ghcr.io/astral-sh/uv:0.9.18 /uv /uvx /bin/

# Install project dependencies
COPY requirements.txt .
RUN uv pip install --system -r requirements.txt

# Copy project files
COPY . .

# Command to start the application
CMD uvicorn main:app --host 0.0.0.0 --port ${SERVER_INTERNAL_PORT} --reload