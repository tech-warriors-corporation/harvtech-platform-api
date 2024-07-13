import { HttpStatusCode } from 'axios'
import request from 'supertest'

import { connect, disconnect, synchronize } from '~config/database'
import { mockAccessToken, mockLogin } from '~config/mocks'
import { HandleRequest, makeHandleRequest } from '~config/tests'
import { AccountPlan } from '~enums/AccountPlan'
import { Header } from '~enums/Header'

describe('Account routes', () => {
    const model = { email: 'contato@harvtech.com', password: 'HarvTech1234!' }
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

    describe('POST: /accounts/login', () => {
        it(`Should return code ${HttpStatusCode.Ok} and account on success response`, async () => {
            const { body, statusCode } = await mockLogin(model)

            expect(body.accessToken).toBeTruthy()
            expect(statusCode).toBe(HttpStatusCode.Ok)
        })

        it(`Should return code ${HttpStatusCode.BadRequest} and have error on bad response`, async () => {
            const { body, statusCode } = await request(handleRequest).post('/accounts/login').send(model)

            expect(body).toHaveProperty('error')
            expect(statusCode).toBe(HttpStatusCode.BadRequest)
        })
    })

    describe('POST: /accounts/register', () => {
        it(`Should create account, return status code ${HttpStatusCode.Ok} and account on success response`, async () => {
            const password = 'abCD1234!'
            const model = {
                name: 'HarvTech',
                email: `test-${crypto.randomUUID()}@email.com`,
                password,
                passwordConfirmation: password,
                plan: AccountPlan.DELUXE,
                acceptedTerms: true,
            }

            const { body, statusCode } = await request(handleRequest).post('/accounts/register').send(model)

            expect(body.accessToken).toBeTruthy()
            expect(statusCode).toBe(HttpStatusCode.Ok)
        })

        it(`Should return code ${HttpStatusCode.BadRequest} and have error on bad response`, async () => {
            const { body, statusCode } = await request(handleRequest)
                .post('/accounts/register')
                .send({ name: 'Test', email: 'test@email.com' })

            expect(body.error.message).toBeTruthy()
            expect(statusCode).toBe(HttpStatusCode.BadRequest)
        })
    })

    describe('GET: /accounts/refresh-token', () => {
        it(`Should return code ${HttpStatusCode.Ok} and new accessToken on success response`, async () => {
            const accessToken = await mockAccessToken(model)
            const { body, statusCode } = await request(handleRequest)
                .get('/accounts/refresh-token')
                .set(Header.X_ACCESS_TOKEN, accessToken)

            expect(body.accessToken !== accessToken).toBe(true)
            expect(statusCode).toBe(HttpStatusCode.Ok)
        })

        it(`Should return code ${HttpStatusCode.BadRequest} and have error on bad response without ${Header.X_ACCESS_TOKEN} header`, async () => {
            const { body, statusCode } = await request(handleRequest)
                .get('/accounts/refresh-token')
                .set(Header.X_ACCESS_TOKEN, '')

            expect(body.error.message).toBeTruthy()
            expect(statusCode).toBe(HttpStatusCode.Unauthorized)
        })
    })
})
