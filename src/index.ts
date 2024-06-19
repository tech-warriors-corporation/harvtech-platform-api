import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import cors from '@koa/cors'
import { connect } from '~config/database'
import { env } from '~config/env'
import { router } from '~routes/index'

const app = new Koa()

app.use(
    cors({
        origin: env.webUrl,
    }),
)

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

const PORT = env.port

connect().then(() => app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`)))
