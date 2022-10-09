# Lokalise Task Assignment

## Introduction

### Step 0

Get a napkin, do a diagram / workflow and plan, start with the end in mind!

### Requirements

1.  Find a web simple website - fork it.
2.  Build and deploy app with docker-compose, VM or on local k8s. Reproduce all the steps locally
3.  Use IaC as much as possible - for example: docker-compose, helm, terraform
    04.1. Build simple script which will mimic CI/CD or you can use some containerised CI/CD
    tool
    04.2. Include security scan stage in it, open source vulnerability scan tool
4.  Do the change, submit it to the local repo, build artefact and deploy it - everything
    locally
5.  App should be accessible from the browser
6.  Introduce some vulnerability - piece of code that will cause security check to fail
7.  Run CI/CD again
8.  Deployment should fail on security scan stage in CI/CD and send notification to
    console
9.  Submit a GitHub repository URL with all the source code and a README.md file
    with all the steps needed so we can build environment ourselves.

## Change log

1.  - Find a web simple website - fork it.

Found 3 possibilities:

https://github.com/NQN-Discord/NQNFrontend
dockerfile is humungus, took long time! And there were npm errors :(

https://github.com/translate/pootle/tree/master/.github
In python, not js, and hasn't been used in 3 years, but good for many services (redis, sql, nginx, django) to show case k8s orchestration

https://github.com/mozilla/translate
Worked correctly with minimal install issues, ripe to dockerise and continue the tasks

So decision is translate! but need to start improving documentation to run it locally. Succeeded in deploying it local host from command line

2.  Build and deploy app with docker-compose.

- Composing a simple Dockerfile that packages web app
