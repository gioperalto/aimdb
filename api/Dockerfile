# Use Python 3.10 as the base image
FROM python:3.10-slim

# Set working directory in the container
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    FLASK_APP=app.py \
    FLASK_ENV=production

# Install system dependencies (curl and wget for Google Cloud SDK installation)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc curl wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Google Cloud SDK installation
RUN mkdir -p /usr/local/gcloud && \
curl -sS -o /tmp/google-cloud-sdk.tar.gz https://dl.google.com/dl/cloudsdk/release/google-cloud-sdk.tar.gz && \
tar -C /usr/local/gcloud -xvf /tmp/google-cloud-sdk.tar.gz && \
/usr/local/gcloud/google-cloud-sdk/install.sh --quiet

# Add gcloud to the PATH (optional, but recommended)
ENV PATH=/usr/local/gcloud/google-cloud-sdk/bin:${PATH}

#  Set env variable for Google Cloud credentials
ENV GOOGLE_APPLICATION_CREDENTIALS=/opt/service-account.json

ENV DD_API_KEY="YOUR_DATADOG_API_KEY"
ENV DD_SITE="datadoghq.com"
ENV DD_SERVICE="aimdb-api"
ENV DD_ENV="development"
ENV DD_VERSION="1.0.0"
ENV DD_LLMOBS_ENABLED=1
ENV DD_LLMOBS_AGENTLESS_ENABLED=1
ENV DD_LLMOBS_ML_APP="aimdb-api"

ENV MONGO_URI="YOUR_MONGODB_URI"

# Copy requirements file first for better caching
COPY api/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY api .

# Expose port that Flask will run on
EXPOSE 5000

# Command to run the application
CMD ["ddtrace-run", "gunicorn", "--bind", "0.0.0.0:5000", "app:app", "--log-file", "-", "--access-logfile", "-"]