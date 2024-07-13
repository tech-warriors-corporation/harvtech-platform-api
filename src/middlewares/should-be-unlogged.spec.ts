import { HttpStatusCode } from 'axios'
import { Next } from 'koa'

import { shouldBeUnlogged } from './should-be-unlogged'

import { Header } from '~enums/Header'
import { ShouldBeUnloggedError } from '~enums/ShouldBeUnloggedError'

jest.mock('~helpers/ErrorHelper', () => ({
    ErrorHelper: {
        createErrorModel: jest.fn().mockImplementation((message: string) => ({ error: { message } })),
    },
}))

describe('shouldBeUnlogged', () => {
    const next: Next = jest.fn()
    let ctx: any

    beforeEach(() => {
        ctx = {
            headers: {},
            body: null,
            status: HttpStatusCode.Ok,
        }
    })

    it(`Should return status code ${HttpStatusCode.BadRequest} if has access token`, async () => {
        ctx.headers[Header.X_ACCESS_TOKEN] = 'Bearer 1234'

        await shouldBeUnlogged(ctx, next)

        expect(ctx.status).toBe(HttpStatusCode.BadRequest)
        expect(ctx.body.error.message).toBe(ShouldBeUnloggedError.HAS_ACCESS_TOKEN)
        expect(next).not.toHaveBeenCalled()
    })

    it(`Should call next and return status code ${HttpStatusCode.Ok} if doesn't have access token`, async () => {
        await shouldBeUnlogged(ctx, next)

        expect(ctx.status).toBe(HttpStatusCode.Ok)
        expect(ctx.body).toBeNull()
        expect(next).toHaveBeenCalled()
    })
})
