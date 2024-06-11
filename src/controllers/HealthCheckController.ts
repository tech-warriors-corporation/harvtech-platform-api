import { Context } from 'koa'

export class HealthCheckController {
    healthCheck(ctx: Context) {
        ctx.body = 'Health check'
    }
}
