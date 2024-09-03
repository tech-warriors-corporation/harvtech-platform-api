import { HttpStatusCode } from 'axios'
import request from 'supertest'

import { connect, disconnect } from '~config/database'
import { mockAccessToken } from '~config/mocks'
import { HandleRequest, makeHandleRequest, makeJpegBase64 } from '~config/tests'
import { Header } from '~enums/Header'
import { ModelType } from '~enums/ModelType'

describe('Predict routes', () => {
    let accessToken = ''
    let handleRequest: HandleRequest

    beforeAll(async () => {
        await connect()
    })

    afterAll(async () => {
        await disconnect()
    })

    beforeEach(async () => {
        accessToken = await mockAccessToken({
            email: `harvtech-${crypto.randomUUID()}@harvtech.com`,
            password: 'HarvTech12!',
        })

        handleRequest = makeHandleRequest()
    })

    describe('POST: /predict/image', () => {
        it(`Should return code ${HttpStatusCode.BadRequest} and have error`, async () => {
            const { body, statusCode } = await request(handleRequest)
                .post('/predict/image')
                .set(Header.X_ACCESS_TOKEN, accessToken)

            expect(body).toHaveProperty('error')
            expect(statusCode).toBe(HttpStatusCode.BadRequest)
        })

        it(`Should return code ${HttpStatusCode.Ok} and text on response`, async () => {
            const { body, statusCode } = await request(handleRequest)
                .post('/predict/image')
                .set(Header.X_ACCESS_TOKEN, accessToken)
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
