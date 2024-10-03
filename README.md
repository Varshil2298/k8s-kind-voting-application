# K8s Kind Voting App

This guide provides a detailed walkthrough for setting up and managing a Kubernetes cluster using Kind (Kubernetes in Docker) on an AWS EC2 instance, along with automating application deployment through Argo CD and GitHub Actions. The guide covers everything from infrastructure setup to continuous deployment, allowing for efficient management and scaling of microservices.

## Overview

This guide covers the steps to:
- Launch an AWS EC2 instance.
- Install Docker and Kind.
- Create a Kubernetes cluster using Kind.
- Install and access kubectl.
- Setting up and configuring Argo CD for continuous deployment.
- Configuring Helm charts for each microservice to manage application deployments.
- Setting up GitHub Actions workflows for CI/CD automation.
- Build and Push the Docker images to Dockerhub through pipeline.
- Automatically updating the Helm values.yaml file with the latest Docker image. 
- Using Argo CD to detect and deploy the latest image version to the Kubernetes cluster.
- Set up the Kubernetes Dashboard.
- Connect and manage your Kubernetes cluster with Argo CD.

## Creating the helm charts 

To create the chart run the following command:

```bash
helm create vote-app-charts
 ```

The main files are needed here are only:

- templates folder : These directory contains all the Kubernetes resource definitions that Helm uses to deploy the application. These are the raw Kubernetes manifests (such as Deployments, Services, ConfigMaps, Ingress, etc.), but with templating enabled. This folder is crucial for defining how the application should be deployed in the Kubernetes cluster.

- Chart.yaml : This file provides metadata about the Helm chart, including its name, version, description, and optional dependencies. It acts as the central configuration file for Helm to understand what this chart is and how it should behave.

- values.yaml: The values.yaml file contains default configuration values for the Helm chart. You can customize this file to provide specific values for the various templates defined in the templates/ folder, such as image names, replica counts, service types, and resource limits. Customizing values.yaml allows you to modify the behavior of the chart without editing the templates directly.




## Architecture



* A front-end web app in [Python](/vote) which lets you vote between two options
* A [Redis](https://hub.docker.com/_/redis/) which collects new votes
* A [.NET](/worker/) worker which consumes votes and stores them in database
* A [Postgres](https://hub.docker.com/_/postgres/) database backed by a Docker volume
* A [Node.js](/result) web app which shows the results of the voting in real time
