declare global {
    namespace NodeJS {
        interface ProcessEnv {
            WEB_URL: string
            AI_URL: string
            JWT_SECRET: string
            JWT_EXPIRES: string
            AZURE_ACCOUNT_NAME: string
            AZURE_ACCOUNT_KEY: string
            AZURE_STORAGE_CONTAINER_URL: string
            DB_HOST: string
            DB_DOCKER_PORT: string
            DB_PORT: string
            DB_NAME: string
            DB_USERNAME: string
            DB_PASSWORD: string
            CRYPTO_ALGORITHM: string
            CRYPTO_KEY: string
            CRYPTO_IV: string
            PORT: string
        }
    }
}
