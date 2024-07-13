import { HttpStatusCode } from 'axios'
import { Context, Next } from 'koa'

import { Header } from '~enums/Header'
import { ShouldBeUnloggedError } from '~enums/ShouldBeUnloggedError'
import { ErrorHelper } from '~helpers/ErrorHelper'

export const shouldBeUnlogged = async (ctx: Context, next: Next) => {
    try {
        const accessTokenWithBearer = ctx.headers[Header.X_ACCESS_TOKEN]

        if (accessTokenWithBearer) throw new Error()

        await next()
    } catch {
        ctx.status = HttpStatusCode.BadRequest
        ctx.body = ErrorHelper.createErrorModel(ShouldBeUnloggedError.HAS_ACCESS_TOKEN)
    }
}
