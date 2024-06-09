import usePredictImageRoutes from './predict-routes'

import Router from '@koa/router'

const router = new Router()

usePredictImageRoutes(router)

export { router }
