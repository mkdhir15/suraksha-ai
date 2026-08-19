#!/usr/bin/env bg
# SurakshaAI Google Cloud Run Deployment Script

set -e

SERVICE_NAME="suraksha-ai"
REGION="us-central1"

echo "=== Deploying SurakshaAI to Google Cloud Run ==="

# Build source and deploy to Cloud Run automatically
gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 8080

echo "=== Deployment Complete ==="
