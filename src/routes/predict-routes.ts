import Router from '@koa/router'
import { PredictController } from '~controllers/PredictController'
import { AiService } from '~services/AiService'
import { AzureService } from '~services/AzureService'

export default (router: Router) => {
    const predictController = new PredictController(new AzureService(), new AiService())

    router.post('/predict/image', predictController.image.bind(predictController))
}
