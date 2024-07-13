import { HttpStatusCode } from 'axios'
import jwt from 'jsonwebtoken'
import { Context, Next } from 'koa'

import { dataSource } from '~config/database'
import { env } from '~config/env'
import { AccountEntity } from '~entities/AccountEntity'
import { Header } from '~enums/Header'
import { ShouldBeLoggedError } from '~enums/ShouldBeLoggedError'
import { ErrorHelper } from '~helpers/ErrorHelper'
import { SanitizeHelper } from '~helpers/SanitizeHelper'
import { AccountAccessTokenPayload } from '~types/account'

export const shouldBeLogged = async (ctx: Context, next: Next) => {
    try {
        const accessTokenWithBearer = ctx.headers[Header.X_ACCESS_TOKEN] as string

        if (!accessTokenWithBearer) throw new Error()

        let {
            account: { id, email },
        } = jwt.verify(accessTokenWithBearer.split(' ')[1], env.jwt.secret) as AccountAccessTokenPayload

        id = SanitizeHelper.input(id)
        email = SanitizeHelper.input(email)

        if (!id || !email) throw new Error()

        const repository = await dataSource.getRepository(AccountEntity)
        const account = await repository.findOne({ where: { id, email } })

        if (!account) throw new Error()

        await next()
    } catch {
        ctx.status = HttpStatusCode.Unauthorized
        ctx.body = ErrorHelper.createErrorModel(ShouldBeLoggedError.HAS_NOT_ACCESS_TOKEN)
    }
}
