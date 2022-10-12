# Roadmap

## Short term

- Implement local automated installation of requisites and mini ci/cd with [Makefile](https://www.gnu.org/software/make/manual/make.html)

- Implement Kubernetes deployment/service with:
    1. Minikube local deployment (instructions to set up)
    2. AWS EKS cloudformation template (automated deployment)

- Container Security Scanning (Falco, Snyk)

- Cloud Infrastructue security scanning (Prowler, OPA)

- More sophisticated nodejs app security scanning. e.g. like [NodeJsScan](https://github.com/ajinabraham/NodeJsScan)

## Long term

- Remove localise specific recruitement content, and start conversation for PR merge to original repo owners 

# TODOs

List of requirements and tech debt accrued during normal development. (To be addressed at later stage / nice to have if times allows)

- Write instructions to set up Nodejs and npm to build locally, use [asdf](https://asdf-vm.com)
- Set up redirect and self signed cert for 443 port in localhost, now insecure 80 !
- Find a slimmed down version node image for docker, like `nodejs:16.17.1-alpine`??
- Create a meaningful justification for using docker-compose (e.g. multi-containers), adding a sql server but not really used now?
- Add some basic [Jest](https://jestjs.io/) Unit tests
- Add linting with ESlint
- Find a container scanning that is not freemium / reuired to have two accounts online. For instance [Clair](https://github.com/quay/clair)
- Move Container scanning only on PR, with tag name as branch 