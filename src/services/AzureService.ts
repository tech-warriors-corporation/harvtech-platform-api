import { ContainerClient, StorageSharedKeyCredential } from '@azure/storage-blob'
import { env } from '~config/env'

export class AzureService {
    private readonly credential: StorageSharedKeyCredential
    private readonly containerClient: ContainerClient

    constructor() {
        this.credential = new StorageSharedKeyCredential(env.azure.accountName, env.azure.accountKey)
        this.containerClient = new ContainerClient(env.azure.storageContainerUrl, this.credential)
    }

    async uploadImage(fileName: string, buffer: Buffer, contentType: string) {
        await this.containerClient.uploadBlockBlob(fileName, buffer, buffer.length, {
            blobHTTPHeaders: { blobContentType: contentType },
        })

        return this.containerClient.getBlobClient(fileName).url
    }
}
