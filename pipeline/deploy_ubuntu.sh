#!/bin/bash
set -euo pipefail

# Authenticate with service account
gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}

# Configure gcloud with project ID
gcloud config set project ${PROJECT_ID}

# Get secrets from Secret Manager
cp flask/.env flask/.env.bak

# Try to get the secret, create empty file if it doesn't exist
if ! gcloud secrets versions access latest \
    --project=${PROJECT_ID} \
    --secret="$DEPLOYMENT_TARGET-$APP-env" > flask/.env 2>/dev/null; then
    echo "Secret $DEPLOYMENT_TARGET-$APP-env not found. Creating empty .env file."
    touch flask/.env
fi

# Create and backup admin panel .env
touch flask/adminPanel/.env
cp flask/adminPanel/.env flask/adminPanel/.env.bak

# Try to get the backoffice secret, create empty file if it doesn't exist
if ! gcloud secrets versions access latest \
    --project=${PROJECT_ID} \
    --secret="$DEPLOYMENT_TARGET-$APP-backoffice-env" > flask/adminPanel/.env 2>/dev/null; then
    echo "Secret $DEPLOYMENT_TARGET-$APP-backoffice-env not found. Creating empty .env file."
    touch flask/adminPanel/.env
fi

# Authenticate to Google Artifact Registry
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet

# Enable BuildKit for faster builds
export DOCKER_BUILDKIT=1

# Build & Push docker image with build caching
REPOSITORY_NAME="livestakes-api"
if [ "$DEPLOYMENT_TARGET" = "stg" ]; then
    REPOSITORY_NAME="livestakes-api-stg"
fi

IMAGE_NAME="image"
FULL_IMAGE_PATH="${ARTIFACT_REGISTRY}/${PROJECT_ID}/${REPOSITORY_NAME}/${IMAGE_NAME}:${IMAGE_TAG}"
CACHE_IMAGE="${ARTIFACT_REGISTRY}/${PROJECT_ID}/${REPOSITORY_NAME}/cache"

echo "Checking for existing image: ${FULL_IMAGE_PATH}"

if gcloud artifacts docker images describe ${FULL_IMAGE_PATH} >/dev/null 2>&1; then
    echo "Image ${FULL_IMAGE_PATH} already exists. Skipping build..."
else
    echo "Image not found. Building and pushing to: ${FULL_IMAGE_PATH}"
    
    # Build using remote cache
    docker build \
        --cache-from ${CACHE_IMAGE} \
        --build-arg BUILDKIT_INLINE_CACHE=1 \
        -t ${FULL_IMAGE_PATH} \
        -t ${CACHE_IMAGE} \
        .

    # Push both the image and cache
    docker push ${FULL_IMAGE_PATH}
    docker push ${CACHE_IMAGE}
fi

# Setup SSH key with proper permissions
mkdir -p /tmp/.ssh
cp /root/.ssh/id_rsa /tmp/.ssh/
chmod 600 /tmp/.ssh/id_rsa

# restore .env file
mv flask/.env.bak flask/.env
mv flask/adminPanel/.env.bak flask/adminPanel/.env

# Deploy to docker swarm
ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i /tmp/.ssh/id_rsa $HOST "
  mkdir -p $APP_DIR
"

# Determine stack file and stack name based on deployment target
if [ "$DEPLOYMENT_TARGET" = "stg" ]; then
  STACK_FILE="stack.stg.yml"
  STACK_NAME="livestakes-stg"
else
  STACK_FILE="stack.yml"
  STACK_NAME="livestakes"
fi

# Copy the appropriate stack file
scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i /tmp/.ssh/id_rsa pipeline/${STACK_FILE} $HOST:$APP_DIR

ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i /tmp/.ssh/id_rsa $HOST "
  gcloud auth configure-docker ${ARTIFACT_REGISTRY} --quiet
  export IMAGE_TAG=$IMAGE_TAG
  docker stack deploy --with-registry-auth -c $APP_DIR/${STACK_FILE} ${STACK_NAME}
"