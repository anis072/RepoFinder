# RepoFinder

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.2.

## Project Architecture

 The project is organized into the following key directories and components:

- **`src/core`**: Houses singleton services and global configurations, ensuring centralized logic that is instantiated only once.
- **`src/core/services`**: Contains reusable services for handling business logic, such as API calls or data manipulation.
- **`src/core/utils`**: Includes utility functions and helpers that can be shared across components.
- **`src/features`**: feature-specific directories (e.g., `repos`) that encapsulate related components, services, and styles.
- **`src/shared`**: Holds shared components,  that can be reused across different features.

## Development Server

To start a local development server, run:

```bash
ng serve
```

## Unit Test

To start a local development server, run:

```bash
ng test
```
