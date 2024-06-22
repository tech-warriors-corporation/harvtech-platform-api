import { AxiosError, HttpStatusCode } from 'axios'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { AccountController } from './AccountController'

import { connect, disconnect, synchronize } from '~config/database'
import { mockAddAccount } from '~config/mocks'
import { AccountLoginError } from '~enums/AccountLoginError'
import { AccountPlan } from '~enums/AccountPlan'
import { AccountRegisterError } from '~enums/AccountRegisterError'
import { AccountType } from '~enums/AccountType'
import { CryptoHelper } from '~helpers/CryptoHelper'

jest.mock('~helpers/CryptoHelper', () => ({
    CryptoHelper: jest.fn().mockImplementation(() => ({
        encrypt: jest.fn().mockReturnValue('hash'),
        compare: jest.fn().mockReturnValue(true),
    })),
}))

describe('AccountController', () => {
    const name = 'HarvTech'
    const email = 'contact@harvtech.com'
    const password = 'HarvTech1234!'
    const type = AccountType.ADMIN
    const plan = AccountPlan.DELUXE
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

        cryptoHelper = new CryptoHelper()
        controller = new AccountController(cryptoHelper)
    })

    describe('login', () => {
        beforeEach(async () => {
            await mockAddAccount({ name, email, password, type, plan })

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
            expect(account).toHaveProperty('plan', plan)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and email required error on no email`, async () => {
            ctx.request.body.email = ''

            await controller.login(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountLoginError.EMAIL_IS_REQUIRED)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and password required error on no password`, async () => {
            ctx.request.body.password = ''

            await controller.login(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountLoginError.PASSWORD_IS_REQUIRED)
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

    describe('register', () => {
        beforeEach(async () => {
            ctx = {
                request: {
                    body: {
                        name,
                        email,
                        password,
                        passwordConfirmation: password,
                        plan,
                        acceptedTerms: true,
                    },
                },
                body: null,
                status: HttpStatusCode.Ok,
            }
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and name required error`, async () => {
            ctx.request.body.name = ''

            await controller.register(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountRegisterError.NAME_IS_REQUIRED)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and email required error`, async () => {
            ctx.request.body.email = ''

            await controller.register(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountRegisterError.EMAIL_IS_REQUIRED)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and password required error`, async () => {
            ctx.request.body.password = ''

            await controller.register(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountRegisterError.PASSWORD_IS_REQUIRED)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and password confirmation required error`, async () => {
            ctx.request.body.passwordConfirmation = ''

            await controller.register(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountRegisterError.PASSWORD_CONFIRMATION_IS_REQUIRED)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and passwords aren't equal error`, async () => {
            ctx.request.body.passwordConfirmation = '1234'

            await controller.register(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountRegisterError.PASSWORDS_ARE_NOT_EQUAL)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and password weak error`, async () => {
            const password = 'HarvTech1234'

            ctx.request.body.password = password
            ctx.request.body.passwordConfirmation = password

            await controller.register(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountRegisterError.PASSWORD_SHOULD_BE_STRONG)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and plan required error`, async () => {
            ctx.request.body.plan = null

            await controller.register(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountRegisterError.PLAN_IS_REQUIRED)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and invalid plan error`, async () => {
            ctx.request.body.plan = 'INVALID_PLAN'

            await controller.register(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountRegisterError.INVALID_PLAN)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and accept terms error`, async () => {
            ctx.request.body.acceptedTerms = false

            await controller.register(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountRegisterError.SHOULD_ACCEPT_TERMS)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and email already registered error`, async () => {
            await mockAddAccount({ name, email, password, type, plan })

            await controller.register(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountRegisterError.EMAIL_ALREADY_REGISTERED)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and general error on throws`, async () => {
            const encrypt = cryptoHelper.encrypt as jest.Mock

            encrypt.mockImplementationOnce(() => {
                throw new Error()
            })

            await controller.register(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountRegisterError.GENERAL_ERROR)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and general error on AxiosError`, async () => {
            const encrypt = cryptoHelper.encrypt as jest.Mock

            encrypt.mockImplementationOnce(() => {
                throw new AxiosError('error')
            })

            await controller.register(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountRegisterError.GENERAL_ERROR)
        })

        it(`Should return status code ${HttpStatusCode.Ok} and created account as JWT`, async () => {
            await controller.register(ctx)

            const { accessToken } = ctx.body
            const { account, ...data } = jwt.decode(accessToken) as JwtPayload

            expect(ctx.status).toBe(HttpStatusCode.Ok)
            expect(data).toHaveProperty('exp')
            expect(account).toHaveProperty('id')
            expect(account).toHaveProperty('name', name)
            expect(account).toHaveProperty('email', email)
            expect(account).toHaveProperty('type', type)
            expect(account).toHaveProperty('plan', plan)
        })
    })
})
