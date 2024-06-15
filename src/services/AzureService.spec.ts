import { AzureService } from './AzureService'

import { ContainerClient } from '@azure/storage-blob'

const expectedImageUrl = 'https://image.com'

jest.mock('@azure/storage-blob', () => ({
    ContainerClient: jest.fn().mockImplementation(() => ({
        uploadBlockBlob: jest.fn(),
        getBlobClient: jest.fn().mockReturnValue({ url: expectedImageUrl }),
    })),
    StorageSharedKeyCredential: jest.fn().mockImplementation(() => ({})),
}))

describe('AzureService', () => {
    let service: AzureService

    beforeEach(() => {
        service = new AzureService()
    })

    describe('uploadImage', () => {
        it('Should upload an image and return the URL', async () => {
            const fileName = 'image.png'
            const blobContentType = 'image/png'
            const buffer = Buffer.from('buffer')
            const instance = (ContainerClient as jest.Mock).mock.results[0].value
            const imageUrl = await service.uploadImage(fileName, buffer, blobContentType)

            expect(instance.uploadBlockBlob).toHaveBeenCalledWith(fileName, buffer, buffer.length, {
                blobHTTPHeaders: { blobContentType },
            })
            expect(instance.getBlobClient).toHaveBeenCalledWith(fileName)
            expect(imageUrl).toBe(expectedImageUrl)
        })
    })
})
