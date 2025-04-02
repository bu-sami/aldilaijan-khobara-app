# Project Structure for Aldilaijan and Khobara Web Application

## Overview

This document outlines the project structure for the dual-business web application serving both Aldilaijan Real Estate Agency and Khobara Valuation Business. The structure is designed to support the microservices-oriented architecture with shared components and business-specific modules.

## Root Directory Structure

```
aldilaijan-khobara-app/
├── frontend/             # Frontend applications
├── backend/              # Backend services
├── shared/               # Shared code and resources
├── docs/                 # Documentation
├── scripts/              # Utility scripts
└── infrastructure/       # Infrastructure as Code
```

## Frontend Structure

```
frontend/
├── admin-panel/          # Shared admin panel application
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom React hooks
│   │   ├── layouts/      # Page layouts
│   │   ├── pages/        # Next.js pages
│   │   ├── services/     # API services
│   │   ├── store/        # Redux store
│   │   ├── styles/       # Global styles
│   │   ├── themes/       # Theme configurations
│   │   └── utils/        # Utility functions
│   ├── .env.local        # Environment variables
│   ├── next.config.js    # Next.js configuration
│   ├── package.json      # Dependencies
│   └── tsconfig.json     # TypeScript configuration
│
├── aldilaijan-portal/    # Aldilaijan client portal
│   ├── [Similar structure to admin-panel]
│
├── khobara-portal/       # Khobara client portal
│   ├── [Similar structure to admin-panel]
│
└── shared-components/    # Shared UI components
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── hooks/        # Shared hooks
    │   ├── styles/       # Shared styles
    │   ├── themes/       # Theme definitions
    │   └── utils/        # Utility functions
    ├── package.json      # Dependencies
    └── tsconfig.json     # TypeScript configuration
```

## Backend Structure

```
backend/
├── shared/               # Shared backend modules
│   ├── src/
│   │   ├── auth/         # Authentication module
│   │   ├── common/       # Common utilities
│   │   ├── config/       # Configuration
│   │   ├── database/     # Database connections
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── entities/     # Shared database entities
│   │   ├── guards/       # Authentication guards
│   │   ├── interceptors/ # HTTP interceptors
│   │   ├── middleware/   # HTTP middleware
│   │   └── utils/        # Utility functions
│   ├── .env              # Environment variables
│   ├── nest-cli.json     # NestJS configuration
│   ├── package.json      # Dependencies
│   └── tsconfig.json     # TypeScript configuration
│
├── aldilaijan/           # Aldilaijan-specific services
│   ├── src/
│   │   ├── properties/   # Property management
│   │   ├── clients/      # Client management
│   │   ├── agents/       # Agent management
│   │   ├── transactions/ # Transaction management
│   │   └── marketing/    # Marketing tools
│   ├── [Similar configuration files]
│
├── khobara/              # Khobara-specific services
│   ├── src/
│   │   ├── valuations/   # Valuation requests
│   │   ├── appraisals/   # Appraisal management
│   │   ├── reports/      # Report generation
│   │   ├── clients/      # Client management
│   │   └── market-data/  # Market data analysis
│   ├── [Similar configuration files]
│
├── integrations/         # External integrations
│   ├── src/
│   │   ├── paci/         # PACI integration
│   │   ├── google-sheets/# Google Sheets integration
│   │   └── moj/          # MOJ integration
│   ├── [Similar configuration files]
│
└── api-gateway/          # API Gateway service
    ├── src/
    │   ├── auth/         # Authentication
    │   ├── proxy/        # Service proxying
    │   ├── rate-limit/   # Rate limiting
    │   └── validation/   # Request validation
    ├── [Similar configuration files]
```

## Shared Code Structure

```
shared/
├── types/                # Shared TypeScript types
│   ├── src/
│   │   ├── entities/     # Entity interfaces
│   │   ├── dto/          # DTO interfaces
│   │   ├── enums/        # Shared enumerations
│   │   └── responses/    # API response types
│   ├── package.json      # Dependencies
│   └── tsconfig.json     # TypeScript configuration
│
└── utils/                # Shared utilities
    ├── src/
    │   ├── formatting/   # Formatting utilities
    │   ├── validation/   # Validation utilities
    │   ├── localization/ # Localization utilities
    │   └── security/     # Security utilities
    ├── package.json      # Dependencies
    └── tsconfig.json     # TypeScript configuration
```

## Documentation Structure

```
docs/
├── architecture/         # Architecture documentation
│   ├── overview.md       # System overview
│   ├── frontend.md       # Frontend architecture
│   ├── backend.md        # Backend architecture
│   └── database.md       # Database architecture
│
├── api/                  # API documentation
│   ├── auth.md           # Authentication API
│   ├── aldilaijan.md     # Aldilaijan-specific APIs
│   └── khobara.md        # Khobara-specific APIs
│
└── deployment/           # Deployment documentation
    ├── setup.md          # Setup instructions
    ├── configuration.md  # Configuration guide
    └── maintenance.md    # Maintenance procedures
```

## Infrastructure Structure

```
infrastructure/
├── terraform/            # Terraform IaC
│   ├── modules/          # Reusable modules
│   ├── environments/     # Environment-specific configs
│   └── variables.tf      # Shared variables
│
├── docker/               # Docker configurations
│   ├── frontend/         # Frontend Dockerfiles
│   ├── backend/          # Backend Dockerfiles
│   └── docker-compose.yml# Local development setup
│
└── kubernetes/           # Kubernetes configurations
    ├── frontend/         # Frontend deployments
    ├── backend/          # Backend deployments
    └── databases/        # Database deployments
```

## Scripts Structure

```
scripts/
├── setup/                # Setup scripts
│   ├── init-project.sh   # Project initialization
│   └── setup-dev-env.sh  # Development environment setup
│
├── database/             # Database scripts
│   ├── init-db.sh        # Database initialization
│   └── seed-data.sh      # Seed data generation
│
└── deployment/           # Deployment scripts
    ├── build.sh          # Build script
    ├── deploy.sh         # Deployment script
    └── rollback.sh       # Rollback script
```

## Configuration Files

```
aldilaijan-khobara-app/
├── .gitignore            # Git ignore patterns
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── jest.config.js        # Jest configuration
├── lerna.json            # Lerna configuration (if using monorepo)
├── package.json          # Root package.json
└── README.md             # Project README
```

This project structure is designed to support the microservices architecture while maintaining clear separation between the two business domains. The shared components facilitate code reuse and consistency across the application.
