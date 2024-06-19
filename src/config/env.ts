import * as dotenv from 'dotenv'

dotenv.config()

export const env = {
    webUrl: process.env.WEB_URL as string,
    aiUrl: process.env.AI_URL as string,
    azure: {
        accountName: process.env.AZURE_ACCOUNT_NAME as string,
        accountKey: process.env.AZURE_ACCOUNT_KEY as string,
        storageContainerUrl: process.env.AZURE_STORAGE_CONTAINER_URL as string,
    },
    database: {
        host: process.env.DB_HOST as string,
        dockerPort: +process.env.DB_DOCKER_PORT! as number,
        port: +process.env.DB_PORT! as number,
        name: process.env.DB_NAME as string,
        username: process.env.DB_USERNAME as string,
        password: process.env.DB_PASSWORD as string,
    },
    port: +process.env.PORT! as number,
}
