# TypeORM Migration Configuration

This directory contains database migrations for the Aldilaijan and Khobara web application.

## Migration Commands

### Generate a new migration

```bash
npm run migration:generate -- -n MigrationName
```

### Run migrations

```bash
npm run migration:run
```

### Revert the last migration

```bash
npm run migration:revert
```

## Migration Structure

Migrations are organized by schema:

- `shared/` - Migrations for the shared schema
- `aldilaijan/` - Migrations for the Aldilaijan schema
- `khobara/` - Migrations for the Khobara schema

## Best Practices

1. Always generate migrations instead of writing them manually
2. Test migrations in development before applying to production
3. Keep migrations small and focused on specific changes
4. Include both up and down methods for reversibility
5. Document complex migrations with comments
