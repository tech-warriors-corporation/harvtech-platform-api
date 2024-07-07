import { HttpStatusCode } from 'axios'
import request from 'supertest'

import { connect, disconnect, synchronize } from '~config/database'
import { mockAddAccount } from '~config/mocks'
import { HandleRequest, makeHandleRequest } from '~config/tests'
import { AccountPlan } from '~enums/AccountPlan'
import { AccountType } from '~enums/AccountType'
import { CryptoHelper } from '~helpers/CryptoHelper'

describe('Account routes', () => {
    const model = { email: 'contato@harvtech.com', password: 'HarvTech1234!' }
    let cryptoHelper: CryptoHelper
    let handleRequest: HandleRequest

    beforeAll(async () => {
        await connect()
    })

    afterAll(async () => {
        await disconnect()
    })

    beforeEach(async () => {
        await synchronize()

        cryptoHelper = new CryptoHelper()
        handleRequest = makeHandleRequest()
    })

    describe('POST: /accounts/login', () => {
        it(`Should return code ${HttpStatusCode.Ok} and account on success response`, async () => {
            await mockAddAccount({
                name: 'HarvTech',
                email: model.email,
                password: cryptoHelper.encrypt(model.password),
                type: AccountType.ADMIN,
                plan: AccountPlan.DELUXE,
            })

            const { body, statusCode } = await request(handleRequest).post('/accounts/login').send(model)

            expect(body.accessToken).toBeTruthy()
            expect(statusCode).toBe(HttpStatusCode.Ok)
        })

        it(`Should return code ${HttpStatusCode.BadRequest} and have error on bad response`, async () => {
            const { body, statusCode } = await request(handleRequest).post('/accounts/login').send(model)

            expect(body).toHaveProperty('error')
            expect(statusCode).toBe(HttpStatusCode.BadRequest)
        })
    })
})
