import axios, { HttpStatusCode } from 'axios'
import MockAdapter from 'axios-mock-adapter'

import { AiService } from './AiService'

import { env } from '~config/env'
import { ModelType } from '~enums/ModelType'

describe('AiService', () => {
    const imageUrl = 'https://safras.com.br/wp-content/uploads/2021/03/arroz-25.jpg'
    const modelType = ModelType.RICE_LEAF
    const text = 'Text'
    const probability = 90
    let aiService: AiService
    let mock: MockAdapter

    beforeEach(() => {
        aiService = new AiService()
        mock = new MockAdapter(axios)
    })

    afterEach(() => {
        mock.reset()
    })

    describe('getPredictImage', () => {
        it('Should return the generated text when getPredictImage is called', async () => {
            mock.onPost(`${env.aiUrl}/predict`).reply(HttpStatusCode.Ok, {
                generated_text: text,
                predicted: { confidence: probability },
            })

            const result = await aiService.getPredictImage(imageUrl, modelType)

            expect(result).toEqual({ text, probability })
        })

        it('Should return the empty values when getPredictImage is called', async () => {
            const text = ''
            const probability = 0

            mock.onPost(`${env.aiUrl}/predict`).reply(HttpStatusCode.Ok, {
                generated_text: text,
                predicted: { confidence: probability },
            })

            const result = await aiService.getPredictImage(imageUrl, modelType)

            expect(result).toEqual({ text, probability })
        })

        it('Should throw an error when the API /predict call fails', async () => {
            mock.onPost(`${env.aiUrl}/predict`).reply(500)

            await expect(aiService.getPredictImage(imageUrl, modelType)).rejects.toThrow()
        })
    })
})
