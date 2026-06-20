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
    id: 2,
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
  {
    id: 3,
    slug: 'terraform-multi-cloud-infrastructure',
    title: 'Terraform Multi-Cloud Infrastructure',
    description: 'Serverless REST API with Lambda, DynamoDB, API Gateway. Live deployment on AWS free tier.',
    fullDescription: 'Production-ready serverless infrastructure deployed live on AWS. REST API with Lambda functions, DynamoDB for data persistence, and API Gateway for HTTP requests. Fully automated with Terraform IaC supporting dev, staging, and production environments. Includes comprehensive CloudWatch monitoring, alarms, point-in-time recovery, and encryption. Cost-optimized to stay within AWS free tier ($0/month).',
    category: 'DevOps',
    techStack: ['Terraform', 'AWS', 'Lambda', 'DynamoDB', 'API Gateway', 'CloudWatch', 'IAM', 'IaC'],
    features: [
      'Serverless REST API (Lambda + API Gateway)',
      'DynamoDB with pay-per-request billing',
      'Point-in-time recovery & encryption',
      'Auto-scaling (unlimited concurrent requests)',
      'CloudWatch logs & performance alarms',
      'Multi-environment support (dev/staging/prod)',
      'Modular Terraform architecture',
      'CORS-enabled REST endpoints',
      'IAM roles with least-privilege access',
      'Health check endpoint for monitoring',
      'Zero-cost deployment (AWS free tier)',
      'Production-ready with compliance tagging'
    ],
    github: 'https://github.com/saybabatunde/Terraform-MultiCloud-Infrastructure',
    deployment: 'https://hbosx8yw9e.execute-api.us-east-1.amazonaws.com/dev/health'
  },
]

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((p) => p.slug === slug)
}

export const getProjectsByCategory = (category: string): Project[] => {
  return projects.filter((p) => p.category === category)
}
