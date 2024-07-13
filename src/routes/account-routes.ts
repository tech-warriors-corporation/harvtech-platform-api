import Router from '@koa/router'
import { AccountController } from '~controllers/AccountController'
import { CryptoHelper } from '~helpers/CryptoHelper'

export default (router: Router) => {
    const url = '/accounts'
    const accountsController = new AccountController(new CryptoHelper())

    router.post(`${url}/login`, accountsController.login.bind(accountsController))
    router.post(`${url}/register`, accountsController.register.bind(accountsController))
    router.get(`${url}/refresh-token`, accountsController.refreshToken.bind(accountsController))
}
