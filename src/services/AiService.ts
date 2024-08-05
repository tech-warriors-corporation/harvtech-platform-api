import axios from 'axios'

import { env } from '~config/env'
import { ModelType } from '~enums/ModelType'

export class AiService {
    private readonly url = env.aiUrl

    async getPredictImage(imageUrl: string, type: ModelType) {
        const {
            data: {
                generated_text,
                predicted: { confidence },
            },
        } = await axios.post(`${this.url}/predict`, {
            content_url: imageUrl,
            model_type: type,
        })

        return { text: generated_text || '', probability: confidence || 0 }
    }
}
