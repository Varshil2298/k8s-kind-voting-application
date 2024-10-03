# K8s Kind Voting App

This guide provides a detailed walkthrough for setting up and managing a Kubernetes cluster using Kind (Kubernetes in Docker) on an AWS EC2 instance, along with automating application deployment through Argo CD and GitHub Actions. The guide covers everything from infrastructure setup to continuous deployment, allowing for efficient management and scaling of microservices.

## Overview

This guide covers the steps to:
- Launch an AWS EC2 instance.
- Install Docker and Kind.
- Create a Kubernetes cluster using Kind.
- Install and access kubectl.
- Setting up and configuring Argo CD for continuous deployment.
- Configuring Helm charts for each microservices
- Setting up GitHub Actions workflows for CI/CD automation.
- Build and Push the Docker images to Dockerhub through pipeline.
- Automatically updating the Helm values.yaml file with the latest Docker image. 
- Using Argo CD to detect and deploy the latest image version to the Kubernetes cluster.
- Set up the Kubernetes Dashboard.
- Connect and manage your Kubernetes cluster with Argo CD.


## Architecture



* A front-end web app in [Python](/vote) which lets you vote between two options
* A [Redis](https://hub.docker.com/_/redis/) which collects new votes
* A [.NET](/worker/) worker which consumes votes and stores them in database
* A [Postgres](https://hub.docker.com/_/postgres/) database backed by a Docker volume
* A [Node.js](/result) web app which shows the results of the voting in real time
