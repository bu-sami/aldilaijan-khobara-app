#!/bin/bash

# Setup Development Environment Script for Aldilaijan and Khobara Web Application
# This script installs all necessary dependencies and tools for development

set -e

echo "Setting up development environment for Aldilaijan and Khobara Web Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js is already installed: $(node -v)"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm not found. Installing npm..."
    sudo apt-get install -y npm
else
    echo "npm is already installed: $(npm -v)"
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker not found. Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    sudo apt-get update
    sudo apt-get install -y docker-ce
else
    echo "Docker is already installed: $(docker --version)"
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose not found. Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose is already installed: $(docker-compose --version)"
fi

# Create Docker Compose file for local development
echo "Creating Docker Compose file for local development..."
cat > /home/ubuntu/aldilaijan-khobara-app/infrastructure/docker/docker-compose.yml << 'EOL'
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: aldilaijan-khobara-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: aldilaijan_khobara_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7
    container_name: aldilaijan-khobara-redis
    ports:
      - "6379:6379"
    networks:
      - app-network

  minio:
    image: minio/minio
    container_name: aldilaijan-khobara-minio
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:
  minio_data:
EOL

# Initialize backend project
echo "Initializing backend project..."
cd /home/ubuntu/aldilaijan-khobara-app/backend

# Create package.json for backend
cat > /home/ubuntu/aldilaijan-khobara-app/backend/package.json << 'EOL'
{
  "name": "aldilaijan-khobara-backend",
  "version": "0.1.0",
  "description": "Backend services for Aldilaijan and Khobara Web Application",
  "private": true,
  "scripts": {
    "start:dev": "echo \"Add start script for development\" && exit 0",
    "build": "echo \"Add build script\" && exit 0",
    "test": "echo \"Add test script\" && exit 0"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "typeorm": "^0.3.0",
    "pg": "^8.11.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/node": "^20.3.1",
    "typescript": "^5.1.3"
  }
}
EOL

# Initialize frontend project
echo "Initializing frontend project..."

# Create package.json for admin panel
mkdir -p /home/ubuntu/aldilaijan-khobara-app/frontend/admin-panel
cat > /home/ubuntu/aldilaijan-khobara-app/frontend/admin-panel/package.json << 'EOL'
{
  "name": "admin-panel",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0",
    "@mui/material": "^5.13.0",
    "@reduxjs/toolkit": "^2.0.0",
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-hook-form": "^7.45.0",
    "react-redux": "^9.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.3.1",
    "@types/react": "^18.2.12",
    "@types/react-dom": "^18.2.5",
    "eslint": "^8.42.0",
    "eslint-config-next": "14.0.0",
    "typescript": "^5.1.3"
  }
}
EOL

# Create Next.js config for admin panel
cat > /home/ubuntu/aldilaijan-khobara-app/frontend/admin-panel/next.config.js << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    localeDetection: true,
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
EOL

# Create tsconfig.json for admin panel
cat > /home/ubuntu/aldilaijan-khobara-app/frontend/admin-panel/tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOL

# Create basic structure for admin panel
mkdir -p /home/ubuntu/aldilaijan-khobara-app/frontend/admin-panel/src/pages
mkdir -p /home/ubuntu/aldilaijan-khobara-app/frontend/admin-panel/src/components
mkdir -p /home/ubuntu/aldilaijan-khobara-app/frontend/admin-panel/src/styles
mkdir -p /home/ubuntu/aldilaijan-khobara-app/frontend/admin-panel/public

# Create basic index page for admin panel
cat > /home/ubuntu/aldilaijan-khobara-app/frontend/admin-panel/src/pages/index.tsx << 'EOL'
import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Aldilaijan & Khobara Admin Panel</title>
        <meta name="description" content="Admin panel for Aldilaijan and Khobara" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
        direction: 'rtl'
      }}>
        <h1>مرحبًا بك في لوحة إدارة الدليجان والخبرة</h1>
        <p>هذه النسخة التجريبية من لوحة الإدارة المشتركة</p>
      </main>
    </div>
  );
}
EOL

# Create _app.tsx for admin panel
cat > /home/ubuntu/aldilaijan-khobara-app/frontend/admin-panel/src/pages/_app.tsx << 'EOL'
import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useRouter } from 'next/router';

// Create theme with RTL support
const getTheme = (isRTL: boolean) => createTheme({
  direction: isRTL ? 'rtl' : 'ltr',
  palette: {
    primary: {
      main: '#C6A052', // Gold/Bronze from Aldilaijan
    },
    secondary: {
      main: '#4D5159', // Dark Gray/Slate from Khobara
    },
  },
  typography: {
    fontFamily: isRTL ? 'Tajawal, Arial, sans-serif' : 'Poppins, Arial, sans-serif',
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isRTL = router.locale === 'ar';
  const theme = React.useMemo(() => getTheme(isRTL), [isRTL]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
EOL

# Create _document.tsx for admin panel
cat > /home/ubuntu/aldilaijan-khobara-app/frontend/admin-panel/src/pages/_document.tsx << 'EOL'
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&family=Poppins:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
EOL

# Create README.md
cat > /home/ubuntu/aldilaijan-khobara-app/README.md << 'EOL'
# Aldilaijan and Khobara Web Application

This is a unified web application serving both Aldilaijan Real Estate Agency and Khobara Valuation Business with a shared admin panel and separate client portals.

## Project Structure

The project follows a microservices-oriented architecture with the following components:

- **Frontend**: Next.js applications for admin panel and client portals
- **Backend**: NestJS services for shared and business-specific functionality
- **Database**: PostgreSQL with separate schemas for each business
- **Integrations**: PACI, Google Sheets, and MOJ transaction data

## Development Setup

1. Install dependencies:
   ```
   cd scripts/setup
   ./setup-dev-env.sh
   ```

2. Start the development environment:
   ```
   cd infrastructure/docker
   docker-compose up -d
   ```

3. Start the backend services:
   ```
   cd backend
   npm run start:dev
   ```

4. Start the admin panel:
   ```
   cd frontend/admin-panel
   npm run dev
   ```

## Documentation

For detailed information about the system, refer to the documentation in the `docs` directory.

## License

Private and Confidential
EOL

echo "Development environment setup completed successfully!"
echo "To start the development environment, run:"
echo "cd /home/ubuntu/aldilaijan-khobara-app/infrastructure/docker && docker-compose up -d"
