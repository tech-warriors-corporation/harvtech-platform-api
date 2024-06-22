import { HttpStatusCode, isAxiosError } from 'axios'
import jwt from 'jsonwebtoken'
import { Context } from 'koa'

import { dataSource } from '~config/database'
import { env } from '~config/env'
import { AccountEntity } from '~entities/AccountEntity'
import { AccountLoginError } from '~enums/AccountLoginError'
import { AccountType } from '~enums/AccountType'
import { CryptoHelper } from '~helpers/CryptoHelper'
import { ErrorHelper } from '~helpers/ErrorHelper'

type AccountLoginBody = {
    email: string
    password: string
}

type AccountLoginAccessTokenData = {
    account: {
        id: string
        name: string
        email: string
        type: AccountType
    }
}

export class AccountController {
    private readonly JWT_SECRET = env.jwt.secret
    private readonly JWT_EXPIRES = env.jwt.expires

    constructor(private readonly cryptoHelper: CryptoHelper) {}

    async login(ctx: Context) {
        try {
            const { email, password } = ctx.request.body as AccountLoginBody
            const repository = await dataSource.getRepository(AccountEntity)
            const account = await repository.findOne({ where: { email }, relations: ['parent'] })

            if (!account) throw new Error(AccountLoginError.ACCOUNT_NOT_FOUND)
            if (!this.cryptoHelper.compare(password, account.password))
                throw new Error(AccountLoginError.INVALID_PASSWORD)

            const data: AccountLoginAccessTokenData = {
                account: {
                    id: account.id,
                    name: account.name,
                    email: account.email,
                    type: account.type,
                },
            }

            ctx.body = { accessToken: jwt.sign(data, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES }) }
        } catch (error) {
            ctx.status = HttpStatusCode.BadRequest
            ctx.body = ErrorHelper.createErrorModel(
                isAxiosError(error)
                    ? AccountLoginError.GENERAL_ERROR
                    : (error as Error).message || AccountLoginError.GENERAL_ERROR,
            )
        }
    }
}
