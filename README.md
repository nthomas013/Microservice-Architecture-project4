Scalable Microservices Architecture on AWS EKS📌 

**Project Overview:**

This project demonstrates a production-grade, highly available microservices architecture for an E-Commerce platform. It automates the entire lifecycle—from infrastructure provisioning with Terraform to automated CI/CD pipelines via Jenkins, and zero-downtime deployments on AWS EKS.

**Key Highlights:**

Infrastructure as Code (IaC): Automated VPC and EKS cluster setup.
Advanced Deployment: Implementation of Blue-Green and Canary release strategies.
Observability: Full-stack monitoring using Prometheus & Grafana.
Artifact Management: Secure image storage using Sonatype Nexus.

**🏗 Architecture** The system follows a microservices pattern where services are decoupled and independently scalable.

VPC: Public and Private subnets across multiple Availability Zones.
EKS Cluster: Managed Kubernetes control plane with auto-scaling node groups.
Ingress: AWS Application Load Balancer (ALB) for intelligent traffic routing.

**🛠 Tech Stack**

Category Tools
Cloud Provider: AWS (EKS, VPC, IAM, ALB)
Infrastructure: Terraform
Orchestration: Kubernetes
CI/CD: Jenkins, Groovy
Artifacts: Sonatype Nexus
Monitoring: Prometheus, Grafana, Alertmanager
Language: Node.js / JavaScript

**🚀 Deployment Strategies**

To ensure 99.9% uptime, this project implements:

1. Blue-Green Deployment
Maintains two identical production environments. Traffic is shifted instantaneously via the ALB Ingress, allowing for immediate rollback if issues arise.

2. Canary Deployment

Gradually rolls out the new version to a small percentage of users (e.g., 10%) using Kubernetes Annotations, ensuring stability before a full release.

**📊 Monitoring & Metrics**

Integrated Prometheus to scrape metrics from the cluster and Grafana for visualization.Cluster Health: CPU/Memory utilization per node.App Metrics: Request latency and error rates.Alerting: Configured Alertmanager for real-time notifications on critical failures.

📂 **Project Structure**

```
├── terraform/          # IaC for VPC and EKS Cluster
├── k8s-manifests/      # Deployments, Services, Ingress, ConfigMaps
├── jenkins/            # Jenkinsfile for CI/CD automation
├── microservices/      # Source code for E-commerce services
└── monitoring/         # Prometheus & Grafana configurations
```

**🔧 Getting Started**

Provision Infrastructure:
```
terraform
terraform init
terraform apply
```

Configure Kubectl:

`eks update-kubeconfig --name <cluster-name> --region <region>`

Run Pipeline:
Connect your GitHub repo to Jenkins and trigger the Jenkinsfile build.

👨‍💻 **Author**: 
Nevin Thomas 
Cloud & DevOps Enthusiast
