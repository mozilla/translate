# Lokalise Task Assignment Roadmap

## Introduction

In this file I attempt to document the process behind this task assignment, specially the adherence to basic rules of Software Development Lifecycle, with focus on security.
Paramount are the following tenets: 

- Clear documentation 
- Code attribution to specific requirements
- Pull Requests
- Code quality
- Shift left security as much as possible 

## Step 0

Get a napkin, do a diagram / workflow and plan, start with the end in mind! Then document the whole journey

## Requirements

- **[Req 1].**  Find a web simple website - fork it.
- **[Req 2].**  Build and deploy app with docker-compose, VM or on local k8s. Reproduce all the steps locally
- **[Req 3].**  Use IaC as much as possible - for example: docker-compose, helm, terraform
- **[Req 4.1].** Build simple script which will mimic CI/CD or you can use some containerised CI/CD
    tool
- **[Req 4.2].** Include security scan stage in it, open source vulnerability scan tool
- **[Req 5].**  Do the change, submit it to the local repo, build artefact and deploy it - everything
    locally
- **[Req 6].**  App should be accessible from the browser
- **[Req 7].**  Introduce some vulnerability - piece of code that will cause security check to fail
- **[Req 8].**  Run CI/CD again
- **[Req 9].**  Deployment should fail on security scan stage in CI/CD and send notification to
    console
- **[Req 10].**  Submit a GitHub repository URL with all the source code and a README.md file with all the steps needed so we can build environment ourselves.

**Extra Req. [Docs]** :

- Instructions must be as clear as possible, with links for navigation
- Every change is tied up to a requirement,described in the commit subject (e.g. mimick integration with Jira / Task tracking software)
- Any and every technical debt accrued must be recorded (e.g. transparency and accountability for backlog groming, planning, etc.) See the [TODOs section](/localise/TODOs.md) for this.


## Change Log

### Req. [01]  - Find a web simple website - fork it.

Found 3 possibilities:

https://github.com/NQN-Discord/NQNFrontend
dockerfile is humungus, took long time! And there were npm errors :(

https://github.com/translate/pootle/tree/master/.github
In python, not js, and hasn't been used in 3 years, but good for many services (redis, sql, nginx, django) to show case k8s orchestration

https://github.com/mozilla/translate
Worked correctly with minimal install issues, ripe to dockerise and continue the tasks

So decision is translate! but need to start improving documentation to run it locally. Succeeded in deploying it local host from command line

### Req. [02] -  Build and deploy app with docker-compose.

- Compose a simple Dockerfile that packages web app
- Check that behaviour is unchanged from the container to the browser
- Create a docker compose template file
- Migrate existing Dockerfile into multi service docker compose (but not being used)

### Req. [03] - CI/CD with IaC

- Create basic test/scan/deploy CI
- welp! :\ this app doesn't have any testing whastsoever :( 
- At least we were able to show a minimal audit vulnerability with `npm audit`

### Req. [04], Req. [05] 

Have been done by default on the original repo, but could be subject to improvement

### Req. [06] [07] - Introduce vulnerability

- Introduce dependency vulnerability on commit [a30ff1e3444ca8630123205228cd534d233b3f0a](https://github.com/marcosnr/translate/commit/a30ff1e3444ca8630123205228cd534d233b3f0a)
```
log4js  <6.4.0
Severity: moderate
Incorrect Default Permissions in log4js - https://github.com2v2-mx6x-wq7q
fix available via `npm audit fix --force`
Will install log4js@6.7.0, which is a breaking change
node_modules/log4js
```
- Successfully catched with CI / Vulnerability step (see this [build](https://github.com/marcosnr/translate/actions/runs/3217375182) :tada:

- End of MVP. But need to go again through all the steps and make it more suitable for purpose (showcase tech skills). To that end added roadmap section in the [TODOs section](/localise/TODOs.md) for this.

- Removed the vulnerability to keep working on better features
- Optimized the workflow

### [Req 4.3] Introduce a more sophisticated vulnerability tool

 First and foremost, security is a integrative approach! It has to be incorporated in the local development before it even reaches the repo. Also a sloppy, hard to read code is more likely to be unsafe / be depracated and not maintained sooner! Therefore, Unit Testing and Linting, while not security per se, are paramount!
 
 - Add the support to run Jest unit tests (hopefully developer will get the hint :P )
 - Added also ESLint for completion purposes, but code is very dirty so need to only warn and by-pass
 - Added out of the box Docker scan for vulnerabilities (but is freemium usage with Snyx)
 - Added container scanning from the CI layer as well
 - It's working but taking it's own sweet time, even after optimizing a little for image size. Hopefully will have time to create two workflows, one for push on branches, and a more thorough one for PR requests
 
 ### [Req 3 Expanded] Better IaC

 Objective is to show some Cloud Infrastructure / Kubernetes capabilities
 