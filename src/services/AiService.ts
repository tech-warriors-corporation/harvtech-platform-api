import axios from 'axios'

import { env } from '~config/env'
import { ModelType } from '~enums/ModelType'

export class AiService {
    private readonly url = env.aiUrl

    async getPredictImage(imageUrl: string, type: ModelType) {
        const { data } = await axios.post(`${this.url}/predict`, {
            content_url: imageUrl,
            model_type: type,
        })

        return data.generated_text
    }
}
