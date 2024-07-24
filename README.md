<p align="center">
    <img align="center" src="./assets/logo.svg" width="120px" alt="HarvTech logo" />
    <br>
    <h1 align="center">HarvTech (API platform)</h1>
    <p align="center">The API to manage communication between other services in HarvTech.</p>
    <p align="center">
        <a href="https://github.com/prettier/prettier"><img align="center" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg" alt="Code style is Prettier" /></a>
        <a href="https://github.com/tech-warriors-corporation/harvtech-platform-api/blob/main/LICENSE"><img align="center" src="https://img.shields.io/github/license/tech-warriors-corporation/harvtech-platform-api" alt="GitHub license" /></a>
        <img align="center" src="https://img.shields.io/github/repo-size/tech-warriors-corporation/harvtech-platform-api" alt="GitHub repository size" />
    </p>
</p>

<hr>

## Install prerequisites
1. [NodeJS and NPM](https://nodejs.org/en/download).
2. [Yarn](https://classic.yarnpkg.com/lang/en/docs/install).

## Setup project
Follow all commands bellow.

### Environment
Create **.env** file in **root** folder with content.
```
WEB_URL=<set Web URL 🔑>
AI_URL=<set AI URL 🔑>
JWT_SECRET=<set JWT secret 🔑>
JWT_EXPIRES=<set JWT expires 🔑>
AZURE_ACCOUNT_NAME=<set Azure account name 🔑>
AZURE_ACCOUNT_KEY=<set Azure account key 🔑>
AZURE_STORAGE_CONTAINER_URL=<set storage container URL 🔑>
DB_HOST=<set database host 🔑>
DB_DOCKER_PORT=<set Docker database port 🔑>
DB_PORT=<set database port 🔑>
DB_NAME=<set database name 🔑>
DB_USERNAME=<set database username 🔑>
DB_PASSWORD=<set database password 🔑>
CRYPTO_ALGORITHM=<set crypto algorithm 🔑>
CRYPTO_KEY=<set crypto key 🔑>
CRYPTO_IV=<set crypto IV 🔑>
PORT=<set port 🔑>
MODE=<set mode 🔑>
```

### Install packages
```
yarn
```

### Active Husky hooks (if not automatically configured)
```
yarn prepare
```

### Database in Docker
```
yarn db
```

### Development
```
yarn dev
```

### Production
```
yarn prod:build && yarn prod:start
```

### Tests
Our tests are made with [Jest](https://jestjs.io). Use `*.test.ts` for integration tests and `*.spec.ts` for unit tests. Run the commands below.

#### Default
``` 
yarn test 
```

#### Watch
``` 
yarn test:watch
```

#### Quiet
``` 
yarn test:quiet
```

#### Coverage
``` 
yarn test:coverage
```

### Migrations (TypeORM):
In this project we use [TypeORM](https://typeorm.io) for migrations. Run the commands below.

#### Run
```
yarn migration:run
```

#### Generate
```
yarn migration:generate src/migrations/<name>
```

#### Synchronize
```
yarn schema:sync
```

## Setup JetBrains (IDE)

### Configure Lint
Go to `File > Settings > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint`, select **Automatic ESLint configuration** and check **Run eslint --fix on save**, or read the [ESLint documentation for WebStorm](https://www.jetbrains.com/help/webstorm/eslint.html).

### Configure Prettier
Go to `File > Settings > Languages & Frameworks > JavaScript > Prettier`, check **On 'Reformat Code' action** and check **On save**, or read the [Prettier documentation for WebStorm](https://www.jetbrains.com/help/webstorm/prettier.html).

## Lint
Run commands:

### Check
```
yarn lint
```

### Fix
```
yarn lint:fix
```

## Prettier
Run commands:

### Check
```
yarn prettier
```

### Fix
```
yarn prettier:fix
```

## Format code
```
yarn format
```

## File patterns
You should be very specific in file names.

## Roadmap
- [X] Add [Axios](https://axios-http.com).
- [X] Add [Jest](https://jestjs.io).
- [X] Study about [Azure SDK for JS](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob/samples/v12/typescript).
- [X] Review code in `review` directory.
- [X] Config project.
- [X] Add coverage code.
- [X] Review project.
- [X] Storage in Danilo's Azure.
- [X] Add [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) and test it.
- [ ] Add [PostgreSQL](https://www.postgresql.org).
- [ ] Use [Crypto](https://www.w3schools.com/nodejs/ref_crypto.asp) from NodeJS with algorithm AES-256-CTR.
- [ ] Add [JWT](https://jwt.io) to authenticate requests.
- [ ] Use an ORM for PostgreSQL.
- [ ] Add a logger.
- [X] Protect passwords with a pattern with numbers, chars and symbols, use minlength too.
- [X] Add test in CI/CD.
- [ ] Add environment variables in Cloud.
- [ ] Protect routes with token.
- [ ] UUID to avoid sequential ids.
- [ ] Render or Neon for PostgreSQL.
- [ ] Remove TODO comments.
- [ ] Coverage badge in this `README.md`.
- [ ] Study about [TypeORM](https://typeorm.io).
- [ ] Add header with secret key for validate request to AI.
- [ ] Make the code more agnostic of framework, library and other tools.
- [ ] Validate our requests with access token.
- [ ] Protect routes with account types.
- [X] Create `SanitizeHelper` for entries.
- [ ] Maybe use Bcrypt.
- [ ] Add health check.
- [ ] Verify user quantities and cultive quantities by account plan.

## Thanks for read
Product made by **[Tech Warriors](https://github.com/tech-warriors-corporation)**.
