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

### Extra Requirements

The objective is to assess how you work, so make sure:

Req. [Docs] :

- Instructions must be as clear as possible, with links for navigation
- Every change is tied up to a requirement,described in the commit subject (e.g. mimick integration with Jira / Task tracking software)
- Any and every technical debt accrued must be recorded (e.g. transparency and accountability for backlog groming, planning, etc.) See the [TODOs section](/localise/TODOs.md) for this.


## Change log

Req. [01]  - Find a web simple website - fork it.

Found 3 possibilities:

https://github.com/NQN-Discord/NQNFrontend
dockerfile is humungus, took long time! And there were npm errors :(

https://github.com/translate/pootle/tree/master/.github
In python, not js, and hasn't been used in 3 years, but good for many services (redis, sql, nginx, django) to show case k8s orchestration

https://github.com/mozilla/translate
Worked correctly with minimal install issues, ripe to dockerise and continue the tasks

So decision is translate! but need to start improving documentation to run it locally. Succeeded in deploying it local host from command line

Req. [02] -  Build and deploy app with docker-compose.

- Compose a simple Dockerfile that packages web app
- Check that behaviour is unchanged from the container to the browser
- Create a docker compose template file
- Migrate existing Dockerfile into multi service docker compose (but not being used)

Req. [03] - CI/CD with IaC
- Create basic test/scan/deploy CI
- welp! :\ this app doesn't have any testing whastsoever :( 
- At least we were able to show a minimal audit vulnerability with `npm audit`

Req. [04], Req. [05] Have been done by default on the original repo, but could bes ubject to improvement

Req. [06] - Introduce vulnerability

- Introduce dependency vulnerability
```
log4js  <6.4.0
Severity: moderate
Incorrect Default Permissions in log4js - https://github.com2v2-mx6x-wq7q
fix available via `npm audit fix --force`
Will install log4js@6.7.0, which is a breaking change
node_modules/log4js
```
- Successfully catched with CI / Vulnerability step (see this [build](https://github.com/marcosnr/translate/actions/runs/3217375182) :tada:
