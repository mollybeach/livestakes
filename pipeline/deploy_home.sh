#!/bin/bash
set -euo pipefail

# get secrets manager
# save a temporary copy of current .env file
export AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id --profile ${AWS_CREDENTIALS_PROFILE})
export AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key --profile ${AWS_CREDENTIALS_PROFILE})


cp flask/.env flask/.env.bak
cp flask/.env.home flask/.env

# aws secretsmanager get-secret-value --secret-id $DEPLOYMENT_TARGET-$APP-env --query SecretString --output text > flask/.env


echo "Deploying to $DEPLOYMENT_TARGET"
echo "env: $(cat flask/.env)"
echo "ECR: $ECR/$DOCKER_REPO:$IMAGE_TAG"
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR

if [ -n "${CREATE_NEW_IMAGE}" ]; then

  docker build -t $ECR/$DOCKER_REPO:$IMAGE_TAG .
  # Authenticate to AWS ECR and Push docker image
  docker push $ECR/$DOCKER_REPO:$IMAGE_TAG

else
  # Pull the latest image
  IMAGE_TAG=$(aws ecr describe-images --repository-name $DOCKER_REPO --query 'imageDetails[0].imageTags[0]' --output text)
  echo "Latest image tag: $IMAGE_TAG"
  if [ -n "$IMAGE_TAG" ]; then
    # Pull the latest image with the fetched tag
    echo "Pulling image with tag: $IMAGE_TAG"
  else
    echo "No image found in the repository."
    exit 1
  fi
fi

# restore .env file
mv flask/.env.bak flask/.env

# # Deploy to docker swarm
ssh -o StrictHostKeyChecking=no -i /root/.ssh/key.pem $HOST "
  mkdir -p $APP_DIR
"
scp -o StrictHostKeyChecking=no -i /root/.ssh/key.pem pipeline/stack_home.yml $HOST:$APP_DIR
ssh -o StrictHostKeyChecking=no -i /root/.ssh/key.pem $HOST "
  aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR
  export IMAGE_TAG=$IMAGE_TAG
  docker stack deploy --with-registry-auth -c $APP_DIR/stack_home.yml $APP
"