import { HttpStatusCode } from 'axios'

import { PredictController } from '~controllers/PredictController'
import { ModelType } from '~enums/ModelType'
import { PredictImageError } from '~enums/PredictImageError'
import { ImagePrefixHelper } from '~helpers/ImagePrefixHelper'
import { AiService } from '~services/AiService'
import { AzureService } from '~services/AzureService'

jest.mock('~services/AzureService', () => ({
    AzureService: jest.fn().mockImplementation(() => ({
        uploadImage: jest.fn().mockResolvedValue('https://image.com'),
    })),
}))

jest.mock('~services/AiService', () => ({
    AiService: jest.fn().mockImplementation(() => ({
        getPredictImage: jest.fn().mockResolvedValue('text'),
    })),
}))

jest.mock('~helpers/ImagePrefixHelper', () => ({
    ImagePrefixHelper: {
        getImagePrefixFromModelType: jest.fn().mockReturnValue('imagePrefix'),
    },
}))

jest.mock('~helpers/ErrorHelper', () => ({
    ErrorHelper: {
        createErrorModel: jest.fn().mockImplementation((message: string) => ({ error: { message } })),
    },
}))

describe('PredictController', () => {
    let azureService: AzureService
    let aiService: AiService
    let getImagePrefixFromModelType: jest.Mock
    let controller: PredictController
    let ctx: any

    beforeEach(() => {
        azureService = new AzureService()
        aiService = new AiService()

        getImagePrefixFromModelType = ImagePrefixHelper.getImagePrefixFromModelType as jest.Mock

        getImagePrefixFromModelType.mockReturnValue('imagePrefix')

        controller = new PredictController(azureService, aiService)

        ctx = {
            request: {
                body: {
                    modelType: ModelType.RICE_LEAF,
                    file: {
                        content: 'data:image/jpeg;base64',
                        type: 'jpg',
                    },
                },
            },
            body: null,
            status: HttpStatusCode.Ok,
        }
    })

    it(`Should return status ${HttpStatusCode.Ok} and text on successful image prediction`, async () => {
        await controller.image(ctx)

        expect(ctx.body.text).toBe('text')
        expect(ctx.status).toBe(HttpStatusCode.Ok)
    })

    it(`Should return status ${HttpStatusCode.BadRequest} and model type required error message if modelType is missing`, async () => {
        ctx.request.body.modelType = null

        await controller.image(ctx)

        expect(ctx.status).toBe(HttpStatusCode.BadRequest)
        expect(ctx.body.error.message).toBe(PredictImageError.MODEL_TYPE_REQUIRED)
    })

    it(`Should return status ${HttpStatusCode.BadRequest} and file required error message if file is missing`, async () => {
        ctx.request.body.file = null

        await controller.image(ctx)

        expect(ctx.status).toBe(HttpStatusCode.BadRequest)
        expect(ctx.body.error.message).toBe(PredictImageError.FILE_REQUIRED)
    })

    it(`Should return status ${HttpStatusCode.BadRequest} and file content not provided error message if file content is not provided`, async () => {
        ctx.request.body.file.content = null

        await controller.image(ctx)

        expect(ctx.status).toBe(HttpStatusCode.BadRequest)
        expect(ctx.body.error.message).toBe(PredictImageError.FILE_CONTENT_REQUIRED)
    })

    it(`Should return status ${HttpStatusCode.BadRequest} and file type not provided error message if file type is not provided`, async () => {
        ctx.request.body.file.type = null

        await controller.image(ctx)

        expect(ctx.status).toBe(HttpStatusCode.BadRequest)
        expect(ctx.body.error.message).toBe(PredictImageError.FILE_TYPE_REQUIRED)
    })

    it(`Should return status ${HttpStatusCode.BadRequest} and invalid file type error message if file type is invalid`, async () => {
        const type = 'INVALID_FILE_TYPE'

        ctx.request.body.file.type = type

        await controller.image(ctx)

        expect(ctx.status).toBe(HttpStatusCode.BadRequest)
        expect(ctx.body.error.message).toBe(PredictImageError.INVALID_FILE_TYPE.replace('type', type))
    })

    it(`Should return status ${HttpStatusCode.BadRequest} and prefix error message if prefix is not found`, async () => {
        const getImagePrefixFromModelType = ImagePrefixHelper.getImagePrefixFromModelType as jest.Mock

        getImagePrefixFromModelType.mockReturnValue('')

        ctx.request.body.modelType = 'INVALID_MODEL_TYPE' as ModelType

        await controller.image(ctx)

        expect(ctx.status).toBe(HttpStatusCode.BadRequest)
        expect(ctx.body.error.message).toBe(PredictImageError.PREFIX_NOT_FOUND)
    })

    it(`Should return status ${HttpStatusCode.BadRequest} and image upload error message if uploadImage returns nothing`, async () => {
        const uploadImage = azureService.uploadImage as jest.Mock

        uploadImage.mockReturnValue('')

        await controller.image(ctx)

        expect(ctx.status).toBe(HttpStatusCode.BadRequest)
        expect(ctx.body.error.message).toBe(PredictImageError.IMAGE_UPLOAD_FAILED)
    })

    it(`Should return status ${HttpStatusCode.BadRequest} and image analysis error message if getPredictImage returns nothing`, async () => {
        const getPredictImage = aiService.getPredictImage as jest.Mock

        getPredictImage.mockReturnValue('')

        await controller.image(ctx)

        expect(ctx.status).toBe(HttpStatusCode.BadRequest)
        expect(ctx.body.error.message).toBe(PredictImageError.IMAGE_ANALYSIS_FAILED)
    })

    it(`Should return status ${HttpStatusCode.BadRequest} and general error message if getPredictImage rejects`, async () => {
        const getPredictImage = aiService.getPredictImage as jest.Mock

        getPredictImage.mockRejectedValue('')

        await controller.image(ctx)

        expect(ctx.status).toBe(HttpStatusCode.BadRequest)
        expect(ctx.body.error.message).toBe(PredictImageError.GENERAL_ERROR)
    })
})
