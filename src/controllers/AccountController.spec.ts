import { AxiosError, HttpStatusCode } from 'axios'
import jwt from 'jsonwebtoken'

import { AccountController } from './AccountController'

import { connect, dataSource, disconnect, synchronize } from '~config/database'
import { mockAddAccount } from '~config/mocks'
import { AccountEntity } from '~entities/AccountEntity'
import { AccountLoginError } from '~enums/AccountLoginError'
import { AccountPlan } from '~enums/AccountPlan'
import { AccountRefreshTokenError } from '~enums/AccountRefreshTokenError'
import { AccountRegisterError } from '~enums/AccountRegisterError'
import { AccountType } from '~enums/AccountType'
import { Header } from '~enums/Header'
import { CryptoHelper } from '~helpers/CryptoHelper'

const accessToken = 'accessToken'
const name = 'HarvTech'
const email = 'contact@harvtech.com'
const password = 'HarvTech1234!'
const type = AccountType.ADMIN
const plan = AccountPlan.DELUXE
const newAccount = { name, email, password, type, plan }

jest.mock('~middlewares/should-be-logged', () => ({
    shouldBeLogged: jest.fn(async (_ctx: any, next: () => Promise<void>) => {
        await next()
    }),
}))

jest.mock('~middlewares/should-be-unlogged', () => ({
    shouldBeUnlogged: jest.fn(async (_ctx: any, next: () => Promise<void>) => {
        await next()
    }),
}))

jest.mock('~helpers/CryptoHelper', () => ({
    CryptoHelper: jest.fn().mockImplementation(() => ({
        encrypt: jest.fn().mockReturnValue('hash'),
        compare: jest.fn().mockReturnValue(true),
    })),
}))

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
    sign: jest.fn().mockReturnValue('accessToken'),
    decode: jest.fn(),
}))

jest.mock('~config/database', () => ({
    dataSource: {
        getRepository: jest.fn().mockReturnValue({
            findOne: jest.fn().mockImplementation(() => newAccount),
            save: jest.fn(),
        }),
    },
    connect: jest.fn(),
    disconnect: jest.fn(),
    synchronize: jest.fn(),
}))

describe('AccountController', () => {
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
            await mockAddAccount(newAccount)

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

            expect(ctx.body.accessToken).toBeTruthy()
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
            const findOne = dataSource.getRepository(AccountEntity).findOne as jest.Mock

            ctx.request.body.email = 'invalid@email.com'

            findOne.mockImplementation(() => null)

            await controller.login(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountLoginError.ACCOUNT_NOT_FOUND)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and general error on throws`, async () => {
            const findOne = dataSource.getRepository(AccountEntity).findOne as jest.Mock
            const compare = cryptoHelper.compare as jest.Mock

            findOne.mockImplementation(() => newAccount)
            compare.mockImplementationOnce(() => {
                throw new Error()
            })

            await controller.login(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountLoginError.GENERAL_ERROR)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and general error on Axios error`, async () => {
            const findOne = dataSource.getRepository(AccountEntity).findOne as jest.Mock
            const compare = cryptoHelper.compare as jest.Mock

            findOne.mockImplementation(() => newAccount)
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
            const findOne = dataSource.getRepository(AccountEntity).findOne as jest.Mock
            const encrypt = cryptoHelper.encrypt as jest.Mock

            findOne.mockImplementation(() => null)
            encrypt.mockImplementationOnce(() => {
                throw new Error()
            })

            await controller.register(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountRegisterError.GENERAL_ERROR)
        })

        it(`Should return status code ${HttpStatusCode.BadRequest} and general error on AxiosError`, async () => {
            const findOne = dataSource.getRepository(AccountEntity).findOne as jest.Mock
            const encrypt = cryptoHelper.encrypt as jest.Mock

            findOne.mockImplementation(() => null)
            encrypt.mockImplementationOnce(() => {
                throw new AxiosError('error')
            })

            await controller.register(ctx)

            expect(ctx.status).toBe(HttpStatusCode.BadRequest)
            expect(ctx.body.error.message).toBe(AccountRegisterError.GENERAL_ERROR)
        })

        it(`Should return status code ${HttpStatusCode.Ok} and created account as JWT`, async () => {
            const save = dataSource.getRepository(AccountEntity).save as jest.Mock

            save.mockImplementation(() => newAccount)

            await controller.register(ctx)

            expect(ctx.status).toBe(HttpStatusCode.Ok)
            expect(ctx.body.accessToken).toBeTruthy()
        })
    })

    describe('refreshToken', () => {
        const account = { id: 'abcd1234', email: 'email@test.com' }
        const accessTokenWithBearer = `Bearer ${accessToken}`

        beforeEach(() => {
            ctx = {
                headers: {},
                body: null,
                status: HttpStatusCode.Ok,
            }
        })

        it(`Should return ${HttpStatusCode.Unauthorized} if no access token is provided`, async () => {
            await controller.refreshToken(ctx)

            expect(ctx.status).toBe(HttpStatusCode.Unauthorized)
            expect(ctx.body.error.message).toEqual(AccountRefreshTokenError.EXPIRED_SESSION)
        })

        it(`Should return status code ${HttpStatusCode.Unauthorized} if the access token is invalid`, async () => {
            const verify = jwt.verify as jest.Mock

            ctx.headers[Header.X_ACCESS_TOKEN] = accessTokenWithBearer

            verify.mockImplementation(() => {
                throw new Error()
            })

            await controller.refreshToken(ctx)

            expect(ctx.status).toBe(HttpStatusCode.Unauthorized)
            expect(ctx.body.error.message).toEqual(AccountRefreshTokenError.EXPIRED_SESSION)
        })

        it(`Should return status code ${HttpStatusCode.Unauthorized} if the account is not found`, async () => {
            const verify = jwt.verify as jest.Mock
            const findOne = dataSource.getRepository(AccountEntity).findOne as jest.Mock

            ctx.headers[Header.X_ACCESS_TOKEN] = accessTokenWithBearer

            verify.mockImplementation(() => ({ account }))
            findOne.mockImplementation(() => null)

            await controller.refreshToken(ctx)

            expect(ctx.status).toBe(HttpStatusCode.Unauthorized)
            expect(ctx.body.error.message).toEqual(AccountRefreshTokenError.EXPIRED_SESSION)
        })

        it(`Should return status code ${HttpStatusCode.Unauthorized} if the id or email are empty string`, async () => {
            const verify = jwt.verify as jest.Mock

            ctx.headers[Header.X_ACCESS_TOKEN] = accessTokenWithBearer

            verify.mockImplementation(() => ({ account: { id: '', email: '' } }))

            await controller.refreshToken(ctx)

            expect(ctx.status).toBe(HttpStatusCode.Unauthorized)
            expect(ctx.body.error.message).toEqual(AccountRefreshTokenError.EXPIRED_SESSION)
        })

        it('Should return a new access token if the old access token is valid', async () => {
            const verify = jwt.verify as jest.Mock
            const sign = jwt.sign as jest.Mock
            const findOne = dataSource.getRepository(AccountEntity).findOne as jest.Mock

            ctx.headers[Header.X_ACCESS_TOKEN] = accessToken

            verify.mockImplementation(() => ({ account }))
            sign.mockReturnValue(accessToken)
            findOne.mockResolvedValue(account)

            await controller.refreshToken(ctx)

            expect(ctx.status).toEqual(HttpStatusCode.Ok)
            expect(ctx.body.accessToken).toEqual(accessToken)
        })
    })
})
