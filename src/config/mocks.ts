import { dataSource } from '~config/database'
import { AccountEntity } from '~entities/AccountEntity'
import { AccountPlan } from '~enums/AccountPlan'
import { AccountType } from '~enums/AccountType'

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
