import { dataSource } from '~config/database'
import { AccountEntity } from '~entities/AccountEntity'
import { AccountType } from '~enums/AccountType'

type AddAccountParams = {
    name: string
    email: string
    password: string
    type: AccountType
}

export const mockAddAccount = async ({ name, email, password, type }: AddAccountParams) => {
    const account = new AccountEntity()

    account.id = crypto.randomUUID()
    account.name = name
    account.email = email
    account.password = password
    account.type = type

    await dataSource.manager.save(AccountEntity, account)
}
