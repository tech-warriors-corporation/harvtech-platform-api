import { HttpStatusCode } from 'axios'
import jwt from 'jsonwebtoken'
import { Next } from 'koa'

import { shouldBeLogged } from './should-be-logged'

import { dataSource } from '~config/database'
import { Header } from '~enums/Header'
import { ShouldBeLoggedError } from '~enums/ShouldBeLoggedError'
import { ErrorHelper } from '~helpers/ErrorHelper'
import { SanitizeHelper } from '~helpers/SanitizeHelper'

jest.mock('~helpers/ErrorHelper', () => ({
    ErrorHelper: {
        createErrorModel: jest.fn().mockImplementation((message: string) => ({ error: { message } })),
    },
}))

jest.mock('~config/database')
jest.mock('~helpers/SanitizeHelper')
jest.mock('jsonwebtoken', () => ({ verify: jest.fn() }))

describe('shouldBeLogged', () => {
    const account = { id: 'abcd5678', email: 'email@test.com' }
    const accessToken = 'Bearer accessToken'
    const next: Next = jest.fn()
    let ctx: any

    beforeEach(() => {
        ctx = {
            headers: {},
            body: null,
            status: HttpStatusCode.Ok,
        }
    })

    it(`Should return status code ${HttpStatusCode.Unauthorized} if no ${Header.X_ACCESS_TOKEN} header is present`, async () => {
        await shouldBeLogged(ctx, next)

        expect(ctx.status).toBe(HttpStatusCode.Unauthorized)
        expect(ctx.body).toEqual(ErrorHelper.createErrorModel(ShouldBeLoggedError.HAS_NOT_ACCESS_TOKEN))
        expect(next).not.toHaveBeenCalled()
    })

    it(`Should return status code ${HttpStatusCode.Unauthorized} if JWT verify fails`, async () => {
        const verify = jwt.verify as jest.Mock

        ctx.headers[Header.X_ACCESS_TOKEN] = accessToken

        verify.mockImplementation(() => {
            throw new Error()
        })

        await shouldBeLogged(ctx, next)

        expect(ctx.status).toBe(HttpStatusCode.Unauthorized)
        expect(ctx.body).toEqual(ErrorHelper.createErrorModel(ShouldBeLoggedError.HAS_NOT_ACCESS_TOKEN))
        expect(next).not.toHaveBeenCalled()
    })

    it(`Should return status code ${HttpStatusCode.Unauthorized} if payload id or email is missing`, async () => {
        const verify = jwt.verify as jest.Mock

        ctx.headers[Header.X_ACCESS_TOKEN] = accessToken

        verify.mockReturnValue({ account: {} })

        await shouldBeLogged(ctx, next)

        expect(ctx.status).toBe(HttpStatusCode.Unauthorized)
        expect(ctx.body).toEqual(ErrorHelper.createErrorModel(ShouldBeLoggedError.HAS_NOT_ACCESS_TOKEN))
        expect(next).not.toHaveBeenCalled()
    })

    it(`Should return status code ${HttpStatusCode.Unauthorized} if account is not found`, async () => {
        const input = SanitizeHelper.input as jest.Mock
        const verify = jwt.verify as jest.Mock
        const getRepository = dataSource.getRepository as jest.Mock

        ctx.headers[Header.X_ACCESS_TOKEN] = accessToken

        input.mockImplementation((input) => input)
        verify.mockReturnValue({ account })
        getRepository.mockReturnValue({ findOne: jest.fn().mockResolvedValue(null) })

        await shouldBeLogged(ctx, next)

        expect(ctx.status).toBe(HttpStatusCode.Unauthorized)
        expect(ctx.body).toEqual(ErrorHelper.createErrorModel(ShouldBeLoggedError.HAS_NOT_ACCESS_TOKEN))
        expect(next).not.toHaveBeenCalled()
    })

    it(`Should call next and return status code ${HttpStatusCode.Ok} if everything is valid`, async () => {
        const verify = jwt.verify as jest.Mock
        const input = SanitizeHelper.input as jest.Mock
        const getRepository = dataSource.getRepository as jest.Mock

        ctx.headers[Header.X_ACCESS_TOKEN] = accessToken

        verify.mockReturnValue({ account })
        input.mockImplementation((input) => input)
        getRepository.mockReturnValue({ findOne: jest.fn().mockResolvedValue(account) })

        await shouldBeLogged(ctx, next)

        expect(ctx.status).toBe(HttpStatusCode.Ok)
        expect(next).toHaveBeenCalled()
    })
})
