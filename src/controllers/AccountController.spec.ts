import { AxiosError, HttpStatusCode } from 'axios'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { AccountController } from './AccountController'

import { connect, disconnect, synchronize } from '~config/database'
import { mockAddAccount } from '~config/mocks'
import { AccountLoginError } from '~enums/AccountLoginError'
import { AccountType } from '~enums/AccountType'
import { CryptoHelper } from '~helpers/CryptoHelper'

jest.mock('~helpers/CryptoHelper', () => ({
    CryptoHelper: jest.fn().mockImplementation(() => ({
        compare: jest.fn().mockReturnValue(true),
    })),
}))

describe('AccountController', () => {
    const name = 'HarvTech'
    const email = 'contact@harvtech.com'
    const password = '1234'
    const type = AccountType.ADMIN
    let cryptoHelper: CryptoHelper
    let controller: AccountController
    let ctx: any

    beforeAll(async () => {
        await connect()
    })

    afterAll(async () => {
        await disconnect()
    })

    beforeEach(async () => {
        await synchronize()
        await mockAddAccount({ name, email, password, type })

        cryptoHelper = new CryptoHelper()
        controller = new AccountController(cryptoHelper)

        ctx = {
            request: {
                body: {
                    email,
                    password,
                },
            },
            body: null,
            status: HttpStatusCode.Ok,
        }
    })

    describe('login', () => {
        it(`Should return status code ${HttpStatusCode.Ok} and account as JWT`, async () => {
            await controller.login(ctx)

            const { accessToken } = ctx.body
            const { account, ...data } = jwt.decode(accessToken) as JwtPayload

            expect(accessToken).toBeTruthy()
            expect(data.exp).toBeTruthy()
            expect(account).toHaveProperty('id')
            expect(account).toHaveProperty('name', name)
            expect(account).toHaveProperty('email', email)
            expect(account).toHaveProperty('type', type)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and password error on invalid password`, async () => {
            const compare = cryptoHelper.compare as jest.Mock

            compare.mockReturnValue(false)

            await controller.login(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountLoginError.INVALID_PASSWORD)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and account not found error on invalid email`, async () => {
            ctx.request.body.email = 'invalid@email.com'

            await controller.login(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountLoginError.ACCOUNT_NOT_FOUND)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and general error on throws`, async () => {
            const compare = cryptoHelper.compare as jest.Mock

            compare.mockImplementationOnce(() => {
                throw new Error()
            })

            await controller.login(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountLoginError.GENERAL_ERROR)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and general error on Axios error`, async () => {
            const compare = cryptoHelper.compare as jest.Mock

            compare.mockImplementationOnce(() => {
                throw new AxiosError('error')
            })

            await controller.login(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountLoginError.GENERAL_ERROR)
        })
    })
})
