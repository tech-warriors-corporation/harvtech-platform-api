import {
    BlobSASPermissions,
    ContainerClient,
    generateBlobSASQueryParameters,
    StorageSharedKeyCredential,
} from '@azure/storage-blob'
import { env } from '~config/env'

export class AzureService {
    private readonly credential: StorageSharedKeyCredential
    private readonly containerClient: ContainerClient
    private readonly FIFTEEN_MINUTES = 900000

    constructor() {
        this.credential = new StorageSharedKeyCredential(env.azure.accountName, env.azure.accountKey)
        this.containerClient = new ContainerClient(env.azure.storageContainerUrl, this.credential)
    }

    async uploadImage(fileName: string, buffer: Buffer, contentType: string) {
        await this.containerClient.uploadBlockBlob(fileName, buffer, buffer.length, {
            blobHTTPHeaders: { blobContentType: contentType },
        })

        return this.generateFileNameUrl(fileName)
    }

    private generateFileNameUrl(fileName: string): string {
        const blobClient = this.containerClient.getBlobClient(fileName)
        const blobSasValues = {
            containerName: this.containerClient.containerName,
            blobName: fileName,
            expiresOn: new Date(new Date().getTime() + this.FIFTEEN_MINUTES),
            permissions: BlobSASPermissions.parse('r'),
        }

        const token = generateBlobSASQueryParameters(blobSasValues, this.credential).toString()

        return `${blobClient.url}?${token}`
    }
}
