import request from 'supertest'

import { dataSource } from '~config/database'
import { makeHandleRequest } from '~config/tests'
import { AccountEntity } from '~entities/AccountEntity'
import { AccountPlan } from '~enums/AccountPlan'
import { AccountType } from '~enums/AccountType'
import { CryptoHelper } from '~helpers/CryptoHelper'

type AddAccountParams = {
    name: string
    email: string
    password: string
    type: AccountType
    plan?: AccountPlan
}

export const mockAddAccount = async (params: AddAccountParams) => {
    const repository = await dataSource.getRepository(AccountEntity)

    await repository.save(params)
}

type LoginModel = {
    email: string
    password: string
}

export const mockLogin = async (model: LoginModel) => {
    const cryptoHelper = new CryptoHelper()

    await mockAddAccount({
        name: 'HarvTech',
        email: model.email,
        password: cryptoHelper.encrypt(model.password),
        type: AccountType.ADMIN,
        plan: AccountPlan.DELUXE,
    })

    const { body, statusCode } = await request(makeHandleRequest()).post('/accounts/login').send(model)

    return { body, statusCode }
}

type AccessTokenModel = LoginModel

export const mockAccessToken = async (model: AccessTokenModel) => {
    const {
        body: { accessToken },
    } = await mockLogin(model)

    return `Bearer ${accessToken}`
}
