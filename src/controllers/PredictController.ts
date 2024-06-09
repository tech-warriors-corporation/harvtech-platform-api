import { Context } from 'koa'
import { v4 as uuid } from 'uuid'

import { ModelType } from '@enums/ModelType'
import { ErrorHelper } from '@helpers/ErrorHelper'
import { ImagePrefixHelper } from '@helpers/ImagePrefixHelper'
import { AiService } from '@services/AiService'
import { AzureService } from '@services/AzureService'
import { Base64File } from '@types/files'
import { imageMimeTypes } from '@utils/mime-types'

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
            const { modelType, file }: PredictImageBody = ctx.request.body

            if (!modelType) throw new Error('Model type not found')
            if (!file) throw new Error('File not found')

            const prefix = ImagePrefixHelper.getImagePrefixFromModelType(modelType)

            if (!prefix) throw new Error('Prefix not found')

            const { content, type } = file

            if (!content) throw new Error('Should contain a content')
            if (!type) throw new Error('Should contain a file type')

            const contentType = imageMimeTypes[type]

            if (!contentType) throw new Error(`Unsupported file type: "${type}"`)

            const buffer = Buffer.from(content.replace(/^data:image\/\w+;base64,/, ''), 'base64')
            const fileName = `${prefix}-${uuid()}.${type}`
            const imageUrl = await this.azureService.uploadImage(fileName, buffer, contentType)

            if (!imageUrl) throw new Error('Could not upload the image')

            const text = await this.aiService.getPredictImage(imageUrl, modelType)

            if (!text) throw new Error('Could not get the text from the AI')

            ctx.body = { text }
        } catch (error) {
            console.error(error)

            ctx.status = 400
            ctx.body = ErrorHelper.createErrorModel('Ocorreu um problema ao obter a previsão da imagem')
        }
    }
}
