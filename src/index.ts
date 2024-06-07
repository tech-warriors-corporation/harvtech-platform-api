import axios from 'axios'
import * as dotenv from 'dotenv'
import Koa, { Context } from 'koa'
import bodyParser from 'koa-bodyparser'

import cors from '@koa/cors'
import Router from '@koa/router'
import { ModelPrefix } from '~/enums/model-prefix'
import { ModelType } from '~/enums/model-type'
import { uploadBase64File } from '~/services/azure-service'

dotenv.config()

const app = new Koa()
const router = new Router()

type Body = {
    file: {
        content: string
        type: string
    }
}

router.post('/upload-file', async (context: Context) => {
    const body = context.request.body as Body
    const url = await uploadBase64File(ModelPrefix.RICE_LEAF, body.file)

    context.body = await axios.post(`${process.env.AI_URL}/predict`, {
        content_url: url,
        model_type: ModelType.RICE_LEAF,
    })
})

app.use(
    cors({
        origin: process.env.WEB_URL,
    }),
)

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

const PORT = process.env.PORT

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
