#!/bin/bash

usage() {
  echo "Usage: $0 [-t DEPLOYMENT_TARGET (required)] [-k IMAGE_TAG (optional)] [-m CREATE_NEW_TAG (optional)] [-p SERVICE_ACCOUNT_KEY_PATH] [-s SSH_KEY_PATH] [-h]" 1>&2
  exit 1
}

SERVICE_ACCOUNT_KEY=${SERVICE_ACCOUNT_KEY:-"${HOME}/wobreeze-448419-cc08aa76b6d2.json"}
SSH_KEY_PATH=${SSH_KEY_PATH:-"${HOME}/.ssh/gcloud_rsa"}
ARCH=$(uname -m)
OS=$(uname -s)

echo "Detected architecture: $ARCH"
echo "Detected OS: $OS"

while getopts ":t:k:m:p:s:h" o; do
  echo "o: $o - OPTARG: $OPTARG"
  case "${o}" in
    t)
      DEPLOYMENT_TARGET=${OPTARG}
      ;;
    k)
      IMAGE_TAG=${OPTARG}
      if ! git rev-parse "${IMAGE_TAG}" >/dev/null 2>&1; then
        echo "Error: The tag '${IMAGE_TAG}' does not exist in git repository."
        exit 1
      fi
      ;;
    m)
      CREATE_NEW_TAG=1
      ;;
    p)
      SERVICE_ACCOUNT_KEY=${OPTARG}
      ;;
    s)
      SSH_KEY_PATH=${OPTARG}
      ;;
    h)
      usage
      ;;
    *)
      usage
      ;;
  esac
done
shift $((OPTIND-1)) 

if [ -z "${DEPLOYMENT_TARGET}" ]; then
    usage
fi

DEPLOYMENT_TARGET=${DEPLOYMENT_TARGET:-"stg"}
COMMIT_SHA=$(git log --pretty=format:'%h' -n 1)
REGION=europe-north1
PROJECT_ID=wobreeze-448419  # Replace with your GCP project ID
ARTIFACT_REGISTRY=europe-north1-docker.pkg.dev
APP=livestakes
DOCKER_REPO=livestakes-api  # This should match your Artifact Registry repository name
IMAGE_TAG=${IMAGE_TAG:-"$DEPLOYMENT_TARGET-$COMMIT_SHA"}
APP_DIR=/home/ubuntu/livestakes/

# Always deploy to prod server
HOST=ubuntu@prod.bitnata.com

# echo "Deploying to $DEPLOYMENT_TARGET with image tag $IMAGE_TAG"
# exit 0

if [ -n "${CREATE_NEW_TAG}" ]; then
    # Fetch the latest tag
    # sync tags from remote
    git fetch --tags

    LATEST_TAG=$(git tag -l | sort -V | tail -n 1)

    echo "Latest tag: $LATEST_TAG"
    # If there are no tags yet, we start with v1.0.0
    if [ -z "${LATEST_TAG}" ]; then
        LATEST_TAG="v1.0.0"
    fi

    # Split the tag into components
    IFS='.' read -ra ADDR <<< "${LATEST_TAG//v/}"

    # Increment the patch number by 1
    LAST_ELEMENT=${ADDR[-1]}
    ADDR[-1]=$((${LAST_ELEMENT} + 1))

    # Construct the new tag
    NEW_TAG="v$(IFS='.' ; echo "${ADDR[*]}")"

    # Set the new tag as the image tag
    IMAGE_TAG=$NEW_TAG

    # Create the new tag and push it to the repo
    git tag $NEW_TAG
    git push origin $NEW_TAG

    echo "Created new tag: $NEW_TAG"
fi

# Build the Docker image
docker build -t deploy-img . -f ./pipeline/Dockerfile

# Run the Docker container, passing the environment variables
docker run -it --rm --name deploy_$APP \
        -e DEPLOYMENT_TARGET=${DEPLOYMENT_TARGET} \
        -e PROJECT_ID=${PROJECT_ID} \
        -e REGION=${REGION} \
        -e ARTIFACT_REGISTRY=${ARTIFACT_REGISTRY} \
        -e APP=${APP} \
        -e DOCKER_REPO=${DOCKER_REPO} \
        -e IMAGE_TAG=${IMAGE_TAG} \
        -e HOST=${HOST} \
        -e ARCH=${ARCH} \
        -e OS=${OS} \
        -e APP_DIR=${APP_DIR} \
        -e GOOGLE_APPLICATION_CREDENTIALS=/root/service-account.json \
        -e SSH_KEY=/root/.ssh/id_rsa \
        -v ${PWD}:/app \
        -v ${SERVICE_ACCOUNT_KEY}:/root/service-account.json:ro \
        -v ${SSH_KEY_PATH}:/root/.ssh/id_rsa:ro \
        -v /var/run/docker.sock:/var/run/docker.sock \
        deploy-img