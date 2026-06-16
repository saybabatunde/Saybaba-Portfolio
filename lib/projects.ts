export interface Project {
  id: number
  slug: string
  title: string
  description: string
  fullDescription: string
  category: string
  techStack: string[]
  features: string[]
  github?: string
  deployment?: string
}

export const projects: Project[] = [
  {
    id: 1,
    slug: 'aws-infrastructure-automation',
    title: 'AWS Infrastructure Automation',
    description: 'Terraform modules for EC2, RDS, S3, and VPC setup',
    fullDescription: 'A comprehensive infrastructure-as-code project using Terraform to automate AWS resource provisioning. Includes reusable modules for compute, database, storage, and networking.',
    category: 'AWS',
    techStack: ['Terraform', 'AWS', 'Python', 'CloudFormation'],
    features: [
      'Modular Terraform code for reusability',
      'EC2 instance automation with auto-scaling',
      'RDS database provisioning and backups',
      'S3 bucket management with encryption',
      'VPC, subnets, and security groups configuration',
      'Automated testing with Terraform plan'
    ],
    github: 'https://github.com/saybabatunde/aws-infrastructure-automation',
  },
  {
    id: 2,
    slug: 'aws-lambda-microservices',
    title: 'AWS Lambda Microservices',
    description: 'Serverless REST APIs using Lambda and API Gateway',
    fullDescription: 'Serverless architecture implementation using AWS Lambda and API Gateway. Build scalable REST APIs without managing servers.',
    category: 'AWS',
    techStack: ['AWS Lambda', 'API Gateway', 'DynamoDB', 'Python', 'Serverless Framework'],
    features: [
      'REST API endpoints with API Gateway',
      'Lambda functions for business logic',
      'DynamoDB for serverless database',
      'IAM roles and policies',
      'CloudWatch logging and monitoring',
      'API authentication and rate limiting'
    ],
    github: 'https://github.com/saybabatunde/aws-lambda-microservices',
  },
  {
    id: 3,
    slug: 'azure-bicep-templates',
    title: 'Azure Bicep Templates',
    description: 'IaC templates for App Service, SQL, Storage deployment',
    fullDescription: 'Infrastructure-as-Code using Azure Bicep for declarative resource deployment. Simplified Azure ARM templates for faster provisioning.',
    category: 'Azure',
    techStack: ['Bicep', 'Azure', 'PowerShell', 'ARM Templates'],
    features: [
      'App Service deployment and configuration',
      'Azure SQL Database provisioning',
      'Storage account setup with access controls',
      'Bicep modules for reusability',
      'Parameter files for different environments',
      'CI/CD integration'
    ],
    github: 'https://github.com/saybabatunde/azure-bicep-templates',
  },
  {
    id: 4,
    slug: 'azure-kubernetes-service',
    title: 'Azure Kubernetes Service',
    description: 'Kubernetes cluster setup and pod deployment',
    fullDescription: 'Kubernetes cluster management and orchestration using Azure Kubernetes Service (AKS). Deploy, manage, and scale containerized applications.',
    category: 'Azure',
    techStack: ['Kubernetes', 'AKS', 'Docker', 'Helm', 'YAML'],
    features: [
      'AKS cluster provisioning and scaling',
      'Pod deployment and management',
      'Service mesh configuration',
      'Helm charts for package management',
      'Ingress and load balancing',
      'Monitoring with Azure Monitor'
    ],
    github: 'https://github.com/saybabatunde/azure-aks-deployment',
  },
  {
    id: 5,
    slug: 'data-pipeline-etl',
    title: 'Data Pipeline ETL',
    description: 'Python-based data processing and transformation pipeline',
    fullDescription: 'End-to-end data pipeline for extracting, transforming, and loading data. Handles large datasets with efficient processing and error handling.',
    category: 'Python',
    techStack: ['Python', 'Pandas', 'PySpark', 'SQL', 'Apache Airflow'],
    features: [
      'Data extraction from multiple sources',
      'Data cleaning and validation',
      'Complex transformations with PySpark',
      'Error handling and logging',
      'Scheduling with Apache Airflow',
      'Performance optimization'
    ],
    github: 'https://github.com/saybabatunde/data-pipeline-etl',
  },
  {
    id: 6,
    slug: 'fastapi-api',
    title: 'API with FastAPI',
    description: 'RESTful API with async request handling',
    fullDescription: 'High-performance REST API built with FastAPI. Handles concurrent requests efficiently with async/await patterns.',
    category: 'Python',
    techStack: ['FastAPI', 'Python', 'PostgreSQL', 'Uvicorn', 'Pydantic'],
    features: [
      'Async endpoint handling',
      'Automatic API documentation with Swagger',
      'Request validation with Pydantic',
      'Database integration with SQLAlchemy',
      'Authentication and authorization',
      'Rate limiting and caching'
    ],
    github: 'https://github.com/saybabatunde/fastapi-api',
  },
  {
    id: 7,
    slug: 'portfolio-website',
    title: 'Portfolio Website',
    description: 'Next.js + Tailwind CSS responsive portfolio',
    fullDescription: 'Modern, responsive portfolio website showcasing projects and skills. Built with Next.js 14 and Tailwind CSS for optimal performance.',
    category: 'Apps',
    techStack: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    features: [
      'Responsive design for all devices',
      'Dark mode UI with Tailwind CSS',
      'Project showcase with details',
      'Authentication system',
      'SEO optimized pages',
      'Fast deployment on Vercel'
    ],
    github: 'https://github.com/saybabatunde/Saybaba-Portfolio',
    deployment: 'https://babatundeportfolio.com'
  },
  {
    id: 8,
    slug: 'task-management-app',
    title: 'Task Management App',
    description: 'React app with local storage and drag-and-drop',
    fullDescription: 'Interactive task management application with drag-and-drop functionality. Persists data to browser local storage.',
    category: 'Apps',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'React DnD'],
    features: [
      'Create, edit, delete tasks',
      'Drag-and-drop task organization',
      'Task categories and priorities',
      'Local storage persistence',
      'Real-time updates',
      'Responsive mobile design'
    ],
    github: 'https://github.com/saybabatunde/task-management-app',
  },
  {
    id: 9,
    slug: 'azure-k8s-cicd-demo',
    title: 'CI/CD Pipeline on Azure Kubernetes',
    description: 'Production-ready DevOps pipeline: GitHub Actions → AKS → Azure Monitor',
    fullDescription: 'Complete CI/CD pipeline demonstrating modern DevOps practices. Automated testing, containerization, Kubernetes orchestration, and observability on Azure.',
    category: 'DevOps',
    techStack: ['GitHub Actions', 'Terraform', 'Kubernetes', 'Docker', 'Azure AKS', 'Application Insights', 'Python', 'Flask'],
    features: [
      'Automated CI/CD pipeline with GitHub Actions',
      'Infrastructure as Code with Terraform',
      'Docker multi-stage builds and registry',
      'Kubernetes deployment with health probes',
      'Zero-downtime rolling updates',
      'Azure Monitor alerts and dashboards',
      'Production-grade security and RBAC',
      'Comprehensive monitoring and logging'
    ],
    github: 'https://github.com/saybabatunde/azure-k8s-cicd-demo',
  },
]

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((p) => p.slug === slug)
}

export const getProjectsByCategory = (category: string): Project[] => {
  return projects.filter((p) => p.category === category)
}
