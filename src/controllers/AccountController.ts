import { HttpStatusCode, isAxiosError } from 'axios'
import jwt from 'jsonwebtoken'
import { Context } from 'koa'

import { dataSource } from '~config/database'
import { env } from '~config/env'
import { UseMiddleware } from '~decorators/UseMiddleware'
import { AccountEntity } from '~entities/AccountEntity'
import { AccountLoginError } from '~enums/AccountLoginError'
import { AccountPlan } from '~enums/AccountPlan'
import { AccountRefreshTokenError } from '~enums/AccountRefreshTokenError'
import { AccountRegisterError } from '~enums/AccountRegisterError'
import { AccountType } from '~enums/AccountType'
import { Header } from '~enums/Header'
import { CryptoHelper } from '~helpers/CryptoHelper'
import { ErrorHelper } from '~helpers/ErrorHelper'
import { SanitizeHelper } from '~helpers/SanitizeHelper'
import { shouldBeLogged } from '~middlewares/should-be-logged'
import { shouldBeUnlogged } from '~middlewares/should-be-unlogged'
import { AccountAccessTokenPayload } from '~types/account'
import { isValidPassword } from '~utils/validations'

type AccountLoginBody = {
    email: string
    password: string
}

type AccountRegisterBody = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
    plan: AccountPlan
    acceptedTerms: boolean
}

export class AccountController {
    private readonly JWT_SECRET = env.jwt.secret
    private readonly JWT_EXPIRES = env.jwt.expires
    private readonly plans = Object.values(AccountPlan)

    constructor(private readonly cryptoHelper: CryptoHelper) {}

    @UseMiddleware(shouldBeUnlogged)
    async login(ctx: Context) {
        try {
            const { password, ...body } = ctx.request.body as AccountLoginBody
            const email = SanitizeHelper.input(body.email)

            if (!email) throw new Error(AccountLoginError.EMAIL_IS_REQUIRED)
            if (!password) throw new Error(AccountLoginError.PASSWORD_IS_REQUIRED)

            const repository = await dataSource.getRepository(AccountEntity)
            const account = await repository.findOne({ where: { email }, relations: ['parent'] })

            if (!account) throw new Error(AccountLoginError.ACCOUNT_NOT_FOUND)
            if (!this.cryptoHelper.compare(password, account.password))
                throw new Error(AccountLoginError.INVALID_PASSWORD)

            ctx.body = this.mountAccessTokenBody(account)
        } catch (error) {
            ctx.status = HttpStatusCode.BadRequest
            ctx.body = ErrorHelper.createErrorModel(
                isAxiosError(error)
                    ? AccountLoginError.GENERAL_ERROR
                    : (error as Error).message || AccountLoginError.GENERAL_ERROR,
            )
        }
    }

    @UseMiddleware(shouldBeUnlogged)
    async register(ctx: Context) {
        try {
            const { password, passwordConfirmation, plan, acceptedTerms, ...body } = ctx.request
                .body as AccountRegisterBody

            const name = SanitizeHelper.input(body.name)
            const email = SanitizeHelper.input(body.email)

            if (!name) throw new Error(AccountRegisterError.NAME_IS_REQUIRED)
            if (!email) throw new Error(AccountRegisterError.EMAIL_IS_REQUIRED)
            if (!password) throw new Error(AccountRegisterError.PASSWORD_IS_REQUIRED)
            if (!passwordConfirmation) throw new Error(AccountRegisterError.PASSWORD_CONFIRMATION_IS_REQUIRED)
            if (password !== passwordConfirmation) throw new Error(AccountRegisterError.PASSWORDS_ARE_NOT_EQUAL)
            if (!isValidPassword(password)) throw new Error(AccountRegisterError.PASSWORD_SHOULD_BE_STRONG)
            if (!plan) throw new Error(AccountRegisterError.PLAN_IS_REQUIRED)
            if (!this.plans.includes(plan)) throw new Error(AccountRegisterError.INVALID_PLAN)
            if (!acceptedTerms) throw new Error(AccountRegisterError.SHOULD_ACCEPT_TERMS)

            const repository = await dataSource.getRepository(AccountEntity)
            const account = await repository.findOne({ where: { email } })

            if (account) throw new Error(AccountRegisterError.EMAIL_ALREADY_REGISTERED)

            const newAccount = await repository.save({
                name,
                email,
                password: this.cryptoHelper.encrypt(password),
                type: AccountType.ADMIN,
                plan,
            })

            ctx.body = this.mountAccessTokenBody(newAccount)
        } catch (error) {
            ctx.status = HttpStatusCode.BadRequest
            ctx.body = ErrorHelper.createErrorModel(
                isAxiosError(error)
                    ? AccountRegisterError.GENERAL_ERROR
                    : (error as Error).message || AccountRegisterError.GENERAL_ERROR,
            )
        }
    }

    @UseMiddleware(shouldBeLogged)
    async refreshToken(ctx: Context) {
        try {
            const accessToken = ctx.headers[Header.X_ACCESS_TOKEN] as string

            if (!accessToken) throw new Error()

            let {
                account: { id, email },
            } = jwt.verify(accessToken.split(' ')[1], this.JWT_SECRET) as AccountAccessTokenPayload

            id = SanitizeHelper.input(id)
            email = SanitizeHelper.input(email)

            if (!id || !email) throw new Error()

            const repository = await dataSource.getRepository(AccountEntity)
            const account = await repository.findOne({ where: { id, email } })

            if (!account) throw new Error()

            ctx.body = this.mountAccessTokenBody(account)
        } catch {
            ctx.status = HttpStatusCode.Unauthorized
            ctx.body = ErrorHelper.createErrorModel(AccountRefreshTokenError.EXPIRED_SESSION)
        }
    }

    private mountAccessTokenBody(account: AccountEntity): { accessToken: string } {
        const payload: AccountAccessTokenPayload = {
            account: {
                id: account.id,
                name: account.name,
                email: account.email,
                type: account.type,
                plan: account.plan,
            },
        }

        return { accessToken: jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES }) }
    }
}
