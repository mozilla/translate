#!/bash
#functions
function publishDockerImage() {
    IMAGE_BASE='translate'
    IMAGE_TAG=$(git rev-parse --short HEAD)
    docker build -t ${IMAGE_BASE}:${IMAGE_TAG} .
    REPOSITORY_NAME=mninoruiz #change this if you want your personal one
    echo "Tagging... Local Image name: ${IMAGE_BASE}:${IMAGE_TAG} Remote: ${REPOSITORY_NAME}/${IMAGE_BASE}:${IMAGE_TAG}"
    docker tag ${IMAGE_BASE}:${IMAGE_TAG} ${REPOSITORY_NAME}/${IMAGE_BASE}:${IMAGE_TAG}
    echo "Pushing to repo: ${REPOSITORY_NAME}..."
    docker push ${REPOSITORY_NAME}/${IMAGE_BASE}:${IMAGE_TAG}
}

# Main
publishDockerImage
