# DevOps Deployment Monitor

An end-to-end CI/CD and GitOps deployment project that automates
building, validating, containerizing, and deploying a React frontend and
Node.js backend on AWS Kubernetes infrastructure.

The goal is to reduce repetitive manual deployment steps, improve
release consistency, and make application delivery repeatable through
CI/CD and GitOps.

## Repositories

-   **Application repository:**
    [devops-deployment-monitor](https://github.com/Lozzbytech/devops-deployment-monitor)
-   **GitOps repository:**
    [devops-monitor-gitops](https://github.com/Lozzbytech/devops-monitor-gitops)

> The GitOps repository contains Kubernetes deployment configuration and
> is updated by the CI pipeline with new image versions. Argo CD uses it
> as the desired state source.

## Problem This Project Solves

Manual deployments often require developers or operators to perform
several steps themselves: check out code, build the application,
validate changes, create container images, push images, update
deployment manifests, and apply changes to a cluster.

This process can be repetitive and prone to human error, inconsistent
deployment configurations, and delays in delivering updates.

This project automates that workflow:

-   Automates application build and validation through Jenkins.
-   Adds code-quality analysis with SonarQube.
-   Packages the frontend and backend into Docker images.
-   Stores versioned images in Amazon ECR.
-   Updates Kubernetes manifests in a separate GitOps repository.
-   Uses Argo CD to reconcile the desired configuration from Git with
    the EKS cluster.
-   Runs the application on Kubernetes, with separate frontend and
    backend workloads.

## Architecture & Workflow

``` mermaid
flowchart LR
    Dev[Developer] -->|Push / Commit| AppRepo[GitHub Application Repository]
    AppRepo -->|Webhook / Trigger| Jenkins[Jenkins on EC2]

    subgraph CI[Continuous Integration - Jenkins]
        Jenkins --> Checkout[Checkout Source]
        Checkout --> Build[Build & Validate]
        Build --> Quality[SonarQube Analysis]
        Quality --> Docker[Build Frontend & Backend Docker Images]
    end

    Docker --> ECR[Amazon ECR - Image Registry]
    ECR --> GitOpsUpdate[Jenkins updates image tags]
    GitOpsUpdate --> GitOpsRepo[GitOps GitHub Repository]

    GitOpsRepo --> Argo[Argo CD]
    Argo -->|Sync Desired State| EKS[Amazon EKS Cluster]

    subgraph Kubernetes[EKS / Kubernetes]
        EKS --> Frontend[Frontend Deployment & Pods]
        EKS --> Backend[Backend Deployment & Pods]
        Frontend --> FrontendSvc[Frontend Service]
        Backend --> BackendSvc[Backend ClusterIP Service]
    end

    Users[Users] --> LB[AWS Load Balancer]
    LB --> FrontendSvc
    FrontendSvc -->|/api reverse proxy| BackendSvc

    EKS -. Supporting observability .-> Monitoring[CloudWatch - if configured]
```

### CI/CD Flow

1.  A developer pushes code to GitHub.
2.  GitHub triggers the Jenkins pipeline.
3.  Jenkins checks out the source code.
4.  The pipeline installs dependencies and builds/validates the frontend
    and backend.
5.  SonarQube analyzes the code quality.
6.  Docker builds separate frontend and backend images.
7.  Jenkins authenticates to Amazon ECR and pushes the images using
    commit-based tags.
8.  Jenkins updates the image tags in the GitOps repository and pushes
    the manifest changes.
9.  Argo CD detects the GitOps repository changes and synchronizes the
    desired state.
10. Kubernetes updates the frontend and backend workloads in EKS.
11. Users access the application through the frontend's AWS Load
    Balancer endpoint.

## Technology Stack & Services

  -----------------------------------------------------------------------
  Service / Technology    Purpose in This Project Problem It Solves
  ----------------------- ----------------------- -----------------------
  **GitHub**              Hosts application code  Version history,
                          and a separate GitOps   collaboration, source
                          repository              control, and a
                                                  reviewable deployment
                                                  configuration

  **Jenkins**             Runs the CI pipeline    Removes repetitive
                          and coordinates build,  manual release steps
                          analysis, Docker image  and standardizes the
                          publishing, and GitOps  pipeline
                          updates                 

  **Amazon EC2**          Hosts Jenkins (and      Provides compute to run
                          SonarQube when run on   the CI server and its
                          the same host)          tooling

  **SonarQube**           Performs                Helps surface
                          code-quality/static     code-quality issues
                          analysis in the         early, before
                          pipeline                deployment

  **Docker**              Packages frontend and   Reduces environment
                          backend into            differences and makes
                          independent container   application packaging
                          images                  consistent

  **Amazon ECR**          Stores frontend and     Central, managed
                          backend Docker images   container-image storage
                                                  for EKS deployments

  **Amazon EKS**          Managed Kubernetes      Orchestrates
                          control plane for the   containers, deployment
                          application cluster     replicas, and
                                                  application workloads

  **Kubernetes**          Deployments, Pods,      Supports declarative
                          Services, ConfigMaps,   deployments, service
                          and workload            discovery, and workload
                          configuration           management

  **Argo CD**             Pulls desired           Git-based deployment
                          deployment state from   automation and drift
                          GitOps repo and         reconciliation
                          synchronizes it to EKS  

  **GitOps**              Uses Git as the         Makes deployment
                          desired-state source    changes versioned,
                          for Kubernetes          auditable, and
                          configuration           repeatable

  **AWS VPC**             Provides isolated       Creates a controlled
                          networking for AWS      network boundary for
                          resources               cloud infrastructure

  **Subnets**             Divide the VPC network  Supports network
                          into public/private     placement and
                          segments as configured  separation of
                                                  internet-facing and
                                                  internal resources

  **Internet Gateway      Enables internet        Provides a VPC internet
  (IGW)**                 connectivity for        path where routing and
                          resources/routes        security rules allow
                          configured to use it    

  **AWS Load Balancer**   Exposes the frontend    Distributes incoming
                          service to external     traffic to application
                          users                   targets; the exact
                                                  load-balancer type
                                                  depends on the
                                                  Kubernetes/AWS
                                                  configuration

  **Amazon CloudWatch**   Metrics, logs, and      Provides visibility
  *(when configured)*     monitoring integrations into operational
                                                  behavior and helps
                                                  diagnose issues

  **Amazon SNS** *(when   Notification/alert      Can distribute alerts
  configured)*            delivery integrations   to subscribed endpoints

  **Amazon S3** *(when    Object storage for      Durable object storage
  configured)*            backups or artifacts,   for data that should
                          if used                 not live only inside
                                                  containers or cluster
                                                  nodes
  -----------------------------------------------------------------------

> **Implementation note:** The core CI/CD, GitOps, and EKS components
> listed above reflect the project workflow. CloudWatch, SNS, and S3 are
> shown as supporting architecture services; use them as implemented
> features only if their integrations/resources have actually been
> configured.

## Application Components

### Frontend

-   React application built with Vite.
-   Served using Nginx in the frontend container.
-   Nginx reverse-proxies `/api/` requests to the backend Kubernetes
    Service.

### Backend

-   Node.js and Express API.
-   Runs separately from the frontend.
-   Exposes the application API on port `5000`.

### Kubernetes Workloads

-   Frontend Deployment: **2 replicas**
-   Backend Deployment: **2 replicas**
-   Frontend Service: `LoadBalancer`
-   Backend Service: `ClusterIP` on port `5000`
-   Namespace: `devops-monitor`

The replica counts are the configured baseline; they can be adjusted for
testing or resource needs.

## GitOps Deployment

The application repository and deployment configuration are kept
separate:

-   **Application repository:** source code, Dockerfiles, Jenkins
    pipeline.
-   **GitOps repository:** Kubernetes manifests and desired image
    versions.

Jenkins publishes images to ECR and updates the GitOps manifests with
commit-based image tags. Argo CD watches the GitOps repository and syncs
changes to the cluster.

Argo CD is configured for automatic synchronization and self-healing.
Pruning is disabled, so resources removed from Git are not automatically
deleted by pruning.

GitOps repository:
**[Lozzbytech/devops-monitor-gitops](https://github.com/Lozzbytech/devops-monitor-gitops)**

## Security & Reliability Practices

-   Separate frontend and backend workloads.
-   Backend service is internal (`ClusterIP`) rather than directly
    exposed as a public service.
-   Container images are stored in Amazon ECR.
-   Kubernetes resource requests and limits are defined for application
    containers.
-   GitOps keeps deployment configuration version-controlled.
-   Argo CD self-healing helps reconcile live state toward the declared
    Git state.
-   Jenkins and application infrastructure can be stopped when not in
    use to help manage AWS costs.

## Cost Considerations

This is a learning/portfolio environment and is not intended to run
continuously.

AWS resources may incur charges even when the application is idle. In
particular, EKS control-plane, EC2/EBS, load balancers, networking
resources, and ECR storage may have costs. For long periods of
inactivity, review the AWS resources and shut down or delete resources
according to the project's runbook. Deleting an EKS cluster means it
must be recreated before the application can run again.

## Repository Structure

The application repository may be organized as:

``` text
devops-deployment-monitor/
├── frontend/
│   ├── src/
│   └── Dockerfile
├── backend/
│   ├── src/
│   └── Dockerfile
├── kubernetes/
│   └── ...
├── Jenkinsfile
└── README.md
```

The separate GitOps repository contains the Kubernetes manifests used by
Argo CD.

## Learning Outcomes

-   Designed and connected an automated CI pipeline.
-   Integrated code-quality analysis into CI.
-   Built and published container images.
-   Implemented a GitOps deployment flow.
-   Deployed frontend and backend workloads on Kubernetes/EKS.
-   Practiced cloud networking, service exposure, and resource
    configuration.
-   Worked with deployment automation, reconciliation, and cost-aware
    infrastructure operation.

## Future Improvements

-   Add automated application tests to the pipeline.
-   Expand monitoring and alerting integrations.
-   Add infrastructure-as-code for repeatable AWS provisioning.
-   Improve security scanning for dependencies and container images.
-   Add documented rollback and recovery procedures.

------------------------------------------------------------------------

**Built as a hands-on DevOps portfolio project by Lozzbytech.**
