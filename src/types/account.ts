import { AccountPlan } from '~enums/AccountPlan'
import { AccountType } from '~enums/AccountType'

export type AccountAccessTokenPayload = {
    account: {
        id: string
        name: string
        email: string
        type: AccountType
        plan?: AccountPlan
    }
}
