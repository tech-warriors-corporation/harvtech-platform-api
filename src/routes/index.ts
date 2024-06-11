import useHealthCheckRoutes from './health-check-routes'
import usePredictImageRoutes from './predict-routes'

import Router from '@koa/router'

const router = new Router()

usePredictImageRoutes(router)
useHealthCheckRoutes(router)

export { router }
