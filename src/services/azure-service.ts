import { v4 as uuid } from 'uuid'

import { ContainerClient, StorageSharedKeyCredential } from '@azure/storage-blob'
import { Base64File } from '~/types/general'

export const uploadBase64File = async (prefixFileName: string, base64File: Base64File) => {
    const account = process.env.AZURE_ACCOUNT_NAME as string
    const accountKey = process.env.AZURE_ACCOUNT_KEY as string
    const credential = new StorageSharedKeyCredential(account, accountKey)
    const containerClient = new ContainerClient(process.env.AZURE_STORAGE_CONTAINER_URL as string, credential)
    const fileName = `${prefixFileName}-${uuid()}.${base64File.type}`
    const buffer = Buffer.from(base64File.content, 'base64')

    await containerClient.uploadBlockBlob(fileName, buffer, buffer.length)

    return containerClient.getBlobClient(fileName).url
}
