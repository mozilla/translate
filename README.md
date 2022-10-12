## Translations Website

### Build Status

[![build](https://github.com/marcosnr/translate/actions/workflows/build.yml/badge.svg)](https://github.com/marcosnr/translate/actions/workflows/build.yml)

### Lokalise Introduction

Please refer to the [Lokalise Roadmap](/lokalise/Roadmap.md) To understand the rationale behind this Home Task Assignment.

## Introduction

This repo contains a static website utilizing the proceedings of project [Bergamot](https://browser.mt/).

The concept is the same as [Firefox Translation](https://github.com/mozilla-extensions/firefox-translations), where the inference occurs entirely in the webpage by utilizing the WebAssembly port of the neural machine translation engine [(marian)](https://github.com/mozilla/bergamot-translator), while the models are dynamically downloaded and loaded as the user switches between the languages.

## Live Demo

The live demo is hosted on Github Pages and published on https://mozilla.github.io/translate.

Compatible and tested on:

- Firefox desktop
- Chrome desktop
- Edge desktop
- Brave desktop
- Firefox Nightly for Android
- Chrome for Android

## Code Guidelines

When working on this project, please bear in mind that:

- Instructions must be as clear as possible, with links for navigation
- Every time you introduce a new tool, include it under resources. If the change is a substantial Infrastructure/Design shift. Attach an [Architecture Design Record](https://cloud.google.com/architecture/architecture-decision-records) documntation for it.
- Any and every technical debt accrued must be recorded (e.g. transparency and accountability for backlog groming, planning, etc.) See the [TODOs section](/lokalise/TODOs.md) for this.


## Development

### Prerequisites

- For local console
  Nodejs

  ```bash
  node -v
  v16.17.1
  ```

- For containerized version:
  Docker Engine
  ```bash
  docker -v
  Docker version 20.10.8, build 3967b7d
  ```
  Docker compose
  
  ```bash
  docker compose version
  Docker Compose version v2.10.2
  ```

### CI/CD

This project leverages [Github actions](https://github.com/features/actions). Templates can be found on the [.github/workflows/build.yml](/.github/workflows/build.yml) folder

- If your deployment fails because audit step found a vulnerability, you can try to issue 

```bash
npm run audit 
```

- To get more information, and then `npm audit fix --force` to attempt resolution. We use []() Or reach out to your friendly [DevSecOps engineer](mailto:marcos@mninoruiz.org) that will gladly pair with you to resolve it :smile: 


## Deployment

There are several ways you can deploy this service. Bear in mind that right now all listen to port http, so they cannot be deployed concurrently unless you change the target ports.

## Console

```bash
# Install dependencies
npm install
# Start nodejs embedded server
bash start_dev_server.sh
# You should see:
# Start httpserver
# HTTP and BinaryJS server started on port 80
```

Now you can Open Firefox Browser new window and go to your [localhost](http://localhost).
Live version can be found at[mozilla.github.io/translate](https://mozilla.github.io/translate)

- Alternatively by:

```bash
# confirm is working
curl -k -s -o /dev/null -w "%{http_code}\n" http://localhost/
# Should return OK: 200
# Windows
firefox http://localhost
# Mac OS
open -a firefox -g http://localhost
```

### Container mode

To build the container:

```bash
IMAGE_NAME=translate
echo ${IMAGE_NAME}
docker build --tag ${IMAGE_NAME} .
```

then all you have to do is run it and expose the port:

```bash
docker run -it -p 80:80 ${IMAGE_NAME} #add -d to have it detached
# Now you can check again in your browser... alternatively:
# check port is listening
curl -v -s http://localhost/ 1> /dev/null # headers only
# see logs
#  when running, do it like:
CONTAINER_ID=$(docker run -d --rm -p 80:80 ${IMAGE_NAME})
# or with docker ps, and then:
docker logs -f ${CONTAINER_ID}
# if you need to troubleshoot
docker exec -it ${CONTAINER_ID} /bin/bash
```
- Leveraging Docker compose for multicontainer orchestration
This is a scaffolding to create persistence capabilities with a MySQL database, but need actual code to connect to it.

```bash
docker compose up #repeat same steps to see onlin
docker compose down
```

- Tagging and pushing your image (necessary to perform container scanning)

```bash
IMAGE_BASE='translate'
IMAGE_TAG=$(git rev-parse --short HEAD)
docker build -t ${IMAGE_BASE}:${IMAGE_TAG} .
REPOSITORY_NAME=mninoruiz #change this if you want your personal one
echo "Confirm: Local Image name: ${IMAGE_BASE}:${IMAGE_TAG} Remote: ${REPOSITORY_NAME}/${IMAGE_BASE}:${IMAGE_TAG}"
docker tag ${IMAGE_BASE}:${IMAGE_TAG} ${REPOSITORY_NAME}/${IMAGE_BASE}:${IMAGE_TAG}
docker push ${REPOSITORY_NAME}/${IMAGE_BASE}:${IMAGE_TAG}
```

- You can also use the available script to publish: [/scripts/publishDockerImage.sh](/scripts/publishDockerImage.sh)

```bash
./scripts/publishDockerImage.sh
```

### Container Vulnerability scanning

To use built in Docker Scan, you need to have a valid login session to DockerHub (obtain one with `docker login` and enter your credentials). Bear in mind you only have 10 free scans a month unless you link it with a Snyx free account as well (using `--token SNYK_AUTH_TOKEN` in the command)

```bash
echo ${IMAGE_NAME}
docker scan --dependency-tree -f Dockerfile ${IMAGE_NAME} # you may add "--exclude-base" for faster scan
```

Nonetheless, there's a dedicated step in the CI/CD pipeline that will publish and Scan containers automatically.

## Service Orchestration (Kubernetes)

For deployment at a scale, you can deploy this in a Kubernetes cluster as a service backed by the corresponding deployment that suits your SLAs

### Locally (Minikube)

```bash
minikube start
kubectl apply -f /k8s/translate_deployment.yml
kubectl apply -f /k8s/translate_svc.yml
```

## Resources

- [Lokalise Home Assignment Roadmap](/lokalise/Roadmap.md)
- [Docker documentation](https://docs.docker.com/)
- [NPM audit documentation](https://docs.npmjs.com/cli/v6/commands/npm-audit)
- [GitHub Action for Container Scanning](https://github.com/crazy-max/ghaction-container-scan)
