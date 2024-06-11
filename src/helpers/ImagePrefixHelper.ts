import { ImagePrefix } from '~enums/ImagePrefix'
import { ModelType } from '~enums/ModelType'

export class ImagePrefixHelper {
    static getImagePrefixFromModelType(modelType: ModelType) {
        if (modelType === ModelType.RICE_LEAF) return ImagePrefix.RICE_LEAF
    }
}
