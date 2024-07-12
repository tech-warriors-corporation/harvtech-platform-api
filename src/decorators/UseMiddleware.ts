import { Context, Middleware, Next } from 'koa'

export const UseMiddleware =
    (middleware: Middleware) => (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value

        descriptor.value = async function (ctx: Context, next: Next) {
            await middleware(ctx, async () => {
                await originalMethod.call(this, ctx, next)
            })
        }

        return descriptor
    }
