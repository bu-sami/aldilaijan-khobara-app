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
