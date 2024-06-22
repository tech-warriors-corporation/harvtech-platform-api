import { HttpStatusCode, isAxiosError } from 'axios'
import jwt from 'jsonwebtoken'
import { Context } from 'koa'

import { dataSource } from '~config/database'
import { env } from '~config/env'
import { AccountEntity } from '~entities/AccountEntity'
import { AccountLoginError } from '~enums/AccountLoginError'
import { AccountPlan } from '~enums/AccountPlan'
import { AccountRegisterError } from '~enums/AccountRegisterError'
import { AccountType } from '~enums/AccountType'
import { CryptoHelper } from '~helpers/CryptoHelper'
import { ErrorHelper } from '~helpers/ErrorHelper'
import { SanitizeHelper } from '~helpers/SanitizeHelper'
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

type AccountAccessTokenData = {
    account: {
        id: string
        name: string
        email: string
        type: AccountType
        plan?: AccountPlan
    }
}

export class AccountController {
    private readonly JWT_SECRET = env.jwt.secret
    private readonly JWT_EXPIRES = env.jwt.expires
    private readonly plans = Object.values(AccountPlan)

    constructor(private readonly cryptoHelper: CryptoHelper) {}

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

    private mountAccessTokenBody(account: AccountEntity): { accessToken: string } {
        const data: AccountAccessTokenData = {
            account: {
                id: account.id,
                name: account.name,
                email: account.email,
                type: account.type,
                plan: account.plan,
            },
        }

        return { accessToken: jwt.sign(data, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES }) }
    }
}
