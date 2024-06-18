import { HttpStatusCode } from 'axios'
import request from 'supertest'

import { connect, disconnect, synchronize } from '~config/database'
import { HandleRequest, makeHandleRequest } from '~config/tests'

// TODO: create controller for these tests
describe('Account routes', () => {
    let handleRequest: HandleRequest

    beforeAll(async () => {
        await connect()
    })

    afterAll(async () => {
        await disconnect()
    })

    beforeEach(async () => {
        await synchronize()

        handleRequest = makeHandleRequest()
    })

    describe('GET: /accounts', () => {
        it(`Should return code ${HttpStatusCode.Ok} and accounts on response`, async () => {
            const { body, statusCode } = await request(handleRequest).get('/accounts')

            expect(body).toEqual([])
            expect(statusCode).toBe(HttpStatusCode.Ok)
        })
    })
})
