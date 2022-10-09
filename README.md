## Translations Website

### Build Status

[![build](https://github.com/marcosnr/translate/actions/workflows/build.yml/badge.svg)](https://github.com/marcosnr/translate/actions/workflows/build.yml)

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
### Console

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
IMAGE_TAG=translate_node16
echo ${IMAGE_TAG}
docker build --tag ${IMAGE_TAG} .
```
then all you have to do is run it and expose the port:

```bash
docker run -it -p 80:80 ${IMAGE_TAG}
# see logs
#  when running, do it like:
CONTAINER_ID=$(docker run -d --rm ${IMAGE_TAG})
# or with docker ps, and then:
docker logs -f ${CONTAINER_ID}
# if you need to troubleshoot
docker exec -it ${CONTAINER_ID} /bin/bash
```