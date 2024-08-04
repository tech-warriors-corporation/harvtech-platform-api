import { HttpStatusCode } from 'axios'
import request from 'supertest'

import { HandleRequest, makeHandleRequest, makeJpegBase64 } from '~config/tests'
import { ModelType } from '~enums/ModelType'

describe('Predict routes', () => {
    let handleRequest: HandleRequest

    beforeEach(() => {
        handleRequest = makeHandleRequest()
    })

    describe('POST: /predict/image', () => {
        it(`Should return code ${HttpStatusCode.BadRequest} and have error`, async () => {
            const { body, statusCode } = await request(handleRequest).post('/predict/image')

            expect(body).toHaveProperty('error')
            expect(statusCode).toBe(HttpStatusCode.BadRequest)
        })

        it(`Should return code ${HttpStatusCode.Ok} and text on response`, async () => {
            const { body, statusCode } = await request(handleRequest)
                .post('/predict/image')
                .send({
                    modelType: ModelType.RICE_LEAF,
                    file: {
                        content: makeJpegBase64(),
                        type: 'jpg',
                    },
                })

            expect(body.text).toBeTruthy()
            expect(body.probability).toBeTruthy()
            expect(statusCode).toBe(HttpStatusCode.Ok)
        }, 20000)
    })
})
