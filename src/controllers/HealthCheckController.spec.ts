import { Context } from 'koa'

import { HealthCheckController } from './HealthCheckController'

describe('HealthCheckController', () => {
    let controller: HealthCheckController
    let ctx: Context

    beforeEach(() => {
        controller = new HealthCheckController()
        ctx = {} as Context
    })

    describe('healthCheck', () => {
        it('Should return "Health check" on response', () => {
            controller.healthCheck(ctx)

            expect(ctx.body).toEqual('Health check')
        })
    })
})
