import request from 'supertest'

import { HandleRequest, makeHandleRequest } from '~config/tests'

describe('Health check routes', () => {
    let handleRequest: HandleRequest

    beforeEach(() => {
        handleRequest = makeHandleRequest()
    })

    describe('GET: /health-check', () => {
        it('Should return code 200 and "Health check" on response', async () => {
            const { text, statusCode } = await request(handleRequest).get('/health-check')

            expect(text).toEqual('Health check')
            expect(statusCode).toBe(200)
        })
    })
})
