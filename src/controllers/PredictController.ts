import { HttpStatusCode } from 'axios'
import { Context } from 'koa'

import { ModelType } from '~enums/ModelType'
import { PredictImageError } from '~enums/PredictImageError'
import { ErrorHelper } from '~helpers/ErrorHelper'
import { ImagePrefixHelper } from '~helpers/ImagePrefixHelper'
import { AiService } from '~services/AiService'
import { AzureService } from '~services/AzureService'
import { Base64File } from '~types/files'
import { imageMimeTypes } from '~utils/mime-types'

type PredictImageBody = {
    modelType: ModelType
    file: Base64File
}

export class PredictController {
    constructor(
        private readonly azureService: AzureService,
        private readonly aiService: AiService,
    ) {}

    async image(ctx: Context) {
        try {
            const { modelType, file } = ctx.request.body as PredictImageBody

            if (!modelType) throw new Error(PredictImageError.MODEL_TYPE_REQUIRED)
            if (!file) throw new Error(PredictImageError.FILE_REQUIRED)

            const prefix = ImagePrefixHelper.getImagePrefixFromModelType(modelType)

            if (!prefix) throw new Error(PredictImageError.PREFIX_NOT_FOUND)

            const { content, type } = file

            if (!content) throw new Error(PredictImageError.FILE_CONTENT_REQUIRED)
            if (!type) throw new Error(PredictImageError.FILE_TYPE_REQUIRED)

            const contentType = imageMimeTypes[type as keyof typeof imageMimeTypes]

            if (!contentType) throw new Error(PredictImageError.INVALID_FILE_TYPE.replace('type', type))

            const buffer = Buffer.from(content.replace(/^data:image\/\w+;base64,/, ''), 'base64')
            const fileName = `${prefix}-${crypto.randomUUID()}.${type}`
            const imageUrl = await this.azureService.uploadImage(fileName, buffer, contentType)

            if (!imageUrl) throw new Error(PredictImageError.IMAGE_UPLOAD_FAILED)

            const text = await this.aiService.getPredictImage(imageUrl, modelType)

            if (!text) throw new Error(PredictImageError.IMAGE_ANALYSIS_FAILED)

            ctx.body = { text }
        } catch (error) {
            ctx.status = HttpStatusCode.BadRequest
            ctx.body = ErrorHelper.createErrorModel((error as Error).message || PredictImageError.GENERAL_ERROR)
        }
    }
}
