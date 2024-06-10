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
AZURE_ACCOUNT_NAME=<set Azure account name 🔑>
AZURE_ACCOUNT_KEY=<set Azure account key 🔑>
AZURE_STORAGE_CONTAINER_URL=<set storage container URL 🔑>
PORT=<set port 🔑>
```

### Install packages
```
yarn
```

### Active Husky hooks (if not automatically configured)
```
yarn prepare
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
Our tests are made with [Jest](https://jestjs.io). Run the commands below.

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
- [ ] Add [Jest](https://jestjs.io).
- [X] Study about [Azure SDK for JS](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob/samples/v12/typescript).
- [X] Review code in `review` directory.
- [ ] Deploy application in Azure and set badge status in `README.md`.
- [ ] Config project.
- [ ] Add coverage code.
- [ ] Review project.
- [X] Storage in Danilo's Azure.
- [X] Add [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) and test it.
- [ ] Add [PostgreSQL](https://www.postgresql.org).
- [ ] Use [Crypto](https://www.w3schools.com/nodejs/ref_crypto.asp) from NodeJS with algorithm AES-256-CTR.
- [ ] Add [JWT](https://jwt.io) to authenticate requests.
- [ ] Use an ORM for PostgreSQL.
- [ ] Add a logger.
- [ ] Add test in CI/CD.
- [ ] Add header with secret key for validate request to AI.
- [ ] Make the code more agnostic of framework, library and other tools.

## Thanks for read
Product made by **[Tech Warriors](https://github.com/tech-warriors-corporation)**.
