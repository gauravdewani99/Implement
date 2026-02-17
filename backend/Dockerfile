FROM python:3.12-slim

WORKDIR /app

# Install system dependencies for asyncpg
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy project files and install dependencies
COPY pyproject.toml .
RUN pip install --no-cache-dir .

# Copy application code
COPY . .

# Make startup script executable
RUN chmod +x start.sh

# Railway provides PORT env var
# start.sh runs migrations then starts uvicorn
CMD ["./start.sh"]
