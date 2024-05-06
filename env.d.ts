declare global {
    namespace NodeJS {
        interface ProcessEnv {
            WEB_URL: string
            AI_URL: string
            AZURE_ACCOUNT_NAME: string
            AZURE_ACCOUNT_KEY: string
            AZURE_STORAGE_CONTAINER_URL: string
            PORT: string
        }
    }
}
