#!/bin/bash
set -euo pipefail

# Authenticate with service account
gcloud auth activate-service-account --key-file=${GOOGLE_APPLICATION_CREDENTIALS}

# Configure gcloud with project ID
gcloud config set project ${PROJECT_ID}

# Get secrets from Secret Manager
# cp src/.env src/.env.bak

# # Try to get the secret, create empty file if it doesn't exist
# if ! gcloud secrets versions access latest \
#     --project=${PROJECT_ID} \
#     --secret="$DEPLOYMENT_TARGET-$APP-env" > src/.env 2>/dev/null; then
#     echo "Secret $DEPLOYMENT_TARGET-$APP-env not found. Creating empty .env file."
#     touch src/.env
# fi

# # Create and backup admin panel .env
# touch src/server/.env
# cp src/server/.env src/server/.env.bak

# Try to get the backoffice secret, create empty file if it doesn't exist
# if ! gcloud secrets versions access latest \
#     --project=${PROJECT_ID} \
#     --secret="$DEPLOYMENT_TARGET-$APP-backoffice-env" > src/server/.env 2>/dev/null; then
#     echo "Secret $DEPLOYMENT_TARGET-$APP-backoffice-env not found. Creating empty .env file."
#     touch src/server/.env
# fi

# Setup buildx
docker buildx create --name mybuilder --use
docker buildx install

# Authenticate to Google Artifact Registry
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet

# Build & Push docker image with increased verbosity
# Make sure repository path matches exactly what's in Artifact Registry
REPOSITORY_NAME="livestakes-api"
if [ "$DEPLOYMENT_TARGET" = "stg" ]; then
    REPOSITORY_NAME="livestakes-api-stg"
fi

IMAGE_NAME="image"  # The actual image name within the repository
FULL_IMAGE_PATH="${ARTIFACT_REGISTRY}/${PROJECT_ID}/${REPOSITORY_NAME}/image:${IMAGE_TAG}"

# Log the full image path for debugging
echo "Checking for existing image: ${FULL_IMAGE_PATH}"

# Check if image already exists in Artifact Registry
if gcloud artifacts docker images describe ${FULL_IMAGE_PATH} >/dev/null 2>&1; then
    echo "Image ${FULL_IMAGE_PATH} already exists. Skipping build..."
else
    echo "Image not found. Building and pushing to: ${FULL_IMAGE_PATH}"
    
    # Test repository access
    gcloud artifacts repositories describe ${REPOSITORY_NAME} \
        --project=${PROJECT_ID} \
        --location=${REGION} || {
        echo "Repository ${REPOSITORY_NAME} not found. Creating it..."
        gcloud artifacts repositories create ${REPOSITORY_NAME} \
            --project=${PROJECT_ID} \
            --location=${REGION} \
            --repository-format=docker
    }

    # Build and push multi-platform image directly
    docker buildx build \
        --platform linux/amd64,linux/arm64 \
        --push \
        -t ${FULL_IMAGE_PATH} .
fi
# Setup SSH key with proper permissions
mkdir -p /tmp/.ssh
cp /root/.ssh/id_rsa /tmp/.ssh/
chmod 600 /tmp/.ssh/id_rsa

# restore .env file
# mv src/.env.bak src/.env
# mv src/server/.env.bak src/server/.env

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

