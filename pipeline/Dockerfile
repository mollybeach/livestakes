# Use the official Google Cloud SDK Alpine image with platform specification
FROM google/cloud-sdk:alpine

ENV DOCKER_BUILDKIT=1
WORKDIR /app

# Install necessary dependencies
RUN apk add --no-cache \
        git \
        bash \
        curl \
        python3 \
        py3-pip \
        util-linux \
        yarn \ 
        docker \
        openrc \
        openssh \
        openssh-client

# Add Docker to the openrc autostart
RUN rc-update add docker boot

# Initialize gcloud with minimal settings
RUN gcloud config set disable_usage_reporting true && \
    gcloud config set component_manager/disable_update_check true

ENTRYPOINT [ "/bin/sh", "-c"]
CMD ["/app/pipeline/deploy.sh"]