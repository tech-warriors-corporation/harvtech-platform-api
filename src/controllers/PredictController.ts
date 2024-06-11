import { Context } from 'koa'
import { v4 as uuid } from 'uuid'

import { ModelType } from '~enums/ModelType'
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

            if (!modelType) throw new Error('Tipo do modelo é obrigatório')
            if (!file) throw new Error('Arquivo é obrigatório')

            const prefix = ImagePrefixHelper.getImagePrefixFromModelType(modelType)

            if (!prefix) throw new Error('Prefixo do modelo não encontrado')

            const { content, type } = file

            if (!content) throw new Error('A imagem deve conter um conteúdo')
            if (!type) throw new Error('A imagem deve conter um tipo')

            const contentType = imageMimeTypes[type as keyof typeof imageMimeTypes]

            if (!contentType)
                throw new Error(`Apenas JPG, JPEG e PNG são permitidos, o tipo da imagem é inválido: "${type}"`)

            const buffer = Buffer.from(content.replace(/^data:image\/\w+;base64,/, ''), 'base64')
            const fileName = `${prefix}-${uuid()}.${type}`
            const imageUrl = await this.azureService.uploadImage(fileName, buffer, contentType)

            if (!imageUrl) throw new Error('Não foi possível salvar a imagem')

            const text = await this.aiService.getPredictImage(imageUrl, modelType)

            if (!text) throw new Error('Não foi possível obter a análise da imagem')

            ctx.body = { text }
        } catch (error) {
            ctx.status = 400
            ctx.body = ErrorHelper.createErrorModel(
                (error as Error).message || 'Ocorreu um problema ao obter a análise da imagem',
            )
        }
    }
}
