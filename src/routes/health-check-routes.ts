import Router from '@koa/router'
import { HealthCheckController } from '~controllers/HealthCheckController'

export default (router: Router) => {
    const healthCheckController = new HealthCheckController()

    router.get('/health-check', healthCheckController.healthCheck.bind(healthCheckController))
}
