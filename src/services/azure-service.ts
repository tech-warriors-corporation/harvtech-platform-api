import { v4 as uuid } from 'uuid'

import { ContainerClient, StorageSharedKeyCredential } from '@azure/storage-blob'
import { Base64File } from '~/types/general'

const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
}

export const uploadBase64File = async (prefixFileName: string, { content, type }: Base64File) => {
    const account = process.env.AZURE_ACCOUNT_NAME as string
    const accountKey = process.env.AZURE_ACCOUNT_KEY as string
    const credential = new StorageSharedKeyCredential(account, accountKey)
    const containerClient = new ContainerClient(process.env.AZURE_STORAGE_CONTAINER_URL as string, credential)
    const fileName = `${prefixFileName}-${uuid()}.${type}`
    const contentType = mimeTypes[type]

    if (!contentType) throw new Error(`Unsupported file type: "${type}"`)

    const buffer = Buffer.from(content.replace(/^data:image\/\w+;base64,/, ''), 'base64')

    await containerClient.uploadBlockBlob(fileName, buffer, buffer.length, {
        blobHTTPHeaders: { blobContentType: contentType },
    })

    return containerClient.getBlobClient(fileName).url
}
