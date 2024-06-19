import { Context } from 'koa'

import Router from '@koa/router'
import { dataSource } from '~config/database'
import { AccountEntity } from '~entities/AccountEntity'

export default (router: Router) => {
    router.get('/accounts', async (ctx: Context) => {
        // TODO: return an object with array
        ctx.body = await dataSource.manager.find(AccountEntity)
    })
}
