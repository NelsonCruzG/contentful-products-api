# Contentful products API

## Description

API that syncronizes data from Contentful products for users to manage and admins to see metrics

## Assumptions and choices

For this project I asume you have the following:

- Internet Conexion
- Credential for Contentful API
- VS Code editor and expertise to setup NestJs projects
- Expertise in using HTTP client software or Swagger documentation (check next sections for details)

Because of different situations (time, preferences, scope, etc.) I made the following choises:

- Did not create a DB population script, so you must run the project and adjust scheduler to fetch the intial data sooner, there is a comment at `src\tasks\tasks.service.ts:132` for that
- Because of the above, I also added a public Users enpoint to create a user that you can use to test protected endpoints.
- For audit reasons, products are not permanently removed from DB, they are hidden when removed by users instead.

## Core

Tecnologies in this project:

- NodeJS: 22.14.0
- NestJS: 10.0.0
- Docker: 4.36.0
- TypeScript: 5.1.3
- Swagger: 8.1.1
- TypeORM: 0.3.21
- PostgreSQL: 15
- pg-admin: 9.0.0

## Installation

```bash
$ npm install
```

## Setup and Run the app

The app is dockerized, therefore it can be run with docker and via docker compose. There are also environment variables that must be set previously in order to run the app.
Volumes are used to keep the information you use save on the database every time you kill the container.

### Prerequisites

1. Create a `.env` file and fill following the `.env.example` variables structure
2. There are two docker-compose files _docker-compose.local.yml_ and _docker-compose.yml_:
   - the **local** one includes pg-admin, and as its names suggests, it is meant to be used in local environments to setup and running the app with minimal effort.
   - The other one is more oriented for a production-like environment where you make use of the self contained app and postgres to serve clients.
3. Make sure you have the local **Core** dependencies in your computer or at least compatible versions.

### Run the app with local composer

First run:

```bash
# Normal logging display
$ docker compose -f docker-compose.local.yml up

# Or detached mode
$ docker compose -f docker-compose.local.yml up -d
```

Then you can run the app in a separate or same terminal:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

This will make available:

1. The postgres database based on the environment variables you define
2. The pg-admin dashboard at http://localhost:5050 by default
3. The app running at http://localhost:3000 by default

### Run the app with production composer

In this case, you do not need any previos/following setup:

```bash
# Normal logging display
$ docker compose up

# Or detached mode
$ docker compose up -d

```

Like the previous case, this will make available:

1. The postgres database based on the environment variables you define
2. The app running at http://localhost:3000 by default

There is no pg-admin for this as it is not for production

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## OpenAPI (Swagger) Documentation

Once the app is running, the docs are available at: {app_base_url}/api

## License

Private
