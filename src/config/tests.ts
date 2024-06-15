import { IncomingMessage, ServerResponse } from 'http'
import { Http2ServerRequest, Http2ServerResponse } from 'http2'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import { router } from '~routes/index'

export type HandleRequest = (
    req: IncomingMessage | Http2ServerRequest,
    res: ServerResponse | Http2ServerResponse,
) => Promise<void>

export const makeHandleRequest = (): HandleRequest => {
    const app = new Koa()

    app.use(bodyParser())
    app.use(router.routes())
    app.use(router.allowedMethods())

    return app.callback()
}
