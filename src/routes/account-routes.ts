import Router from '@koa/router'
import { AccountController } from '~controllers/AccountController'
import { CryptoHelper } from '~helpers/CryptoHelper'

export default (router: Router) => {
    const accountsController = new AccountController(new CryptoHelper())

    router.post('/accounts/login', accountsController.login.bind(accountsController))
}
