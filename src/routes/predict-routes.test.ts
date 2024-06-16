import request from 'supertest'

import { HandleRequest, makeHandleRequest } from '~config/tests'
import { ModelType } from '~enums/ModelType'

jest.mock('~services/AzureService', () => ({
    AzureService: jest.fn().mockImplementation(() => ({
        uploadImage: jest.fn().mockReturnValue('https://image.png'),
    })),
}))

jest.mock('~services/AiService', () => ({
    AiService: jest.fn().mockImplementation(() => ({
        getPredictImage: jest.fn().mockReturnValue('Predict text'),
    })),
}))

describe('Predict routes', () => {
    let handleRequest: HandleRequest

    beforeEach(() => {
        handleRequest = makeHandleRequest()
    })

    describe('POST: /predict/image', () => {
        it('Should return code 400 and have error', async () => {
            const { body, statusCode } = await request(handleRequest).post('/predict/image')

            expect(body).toHaveProperty('error')
            expect(statusCode).toBe(400)
        })

        it('Should return code 200 and text on response', async () => {
            const { body, statusCode } = await request(handleRequest)
                .post('/predict/image')
                .send({
                    modelType: ModelType.RICE_LEAF,
                    file: {
                        content: 'data:image/jpeg;base64',
                        type: 'jpg',
                    },
                })

            expect(body).toEqual({ text: 'Predict text' })
            expect(statusCode).toBe(200)
        })
    })
})
