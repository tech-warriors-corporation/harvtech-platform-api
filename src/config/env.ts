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
    port: +process.env.PORT! as number,
}
