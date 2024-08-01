import { ImagePrefix } from '~enums/ImagePrefix'
import { ModelType } from '~enums/ModelType'

export class ImagePrefixHelper {
    static getImagePrefixFromModelType(modelType: ModelType) {
        if (modelType === ModelType.RICE_LEAF) return ImagePrefix.RICE_LEAF
        if (modelType === ModelType.BEAN_LEAF) return ImagePrefix.BEAN_LEAF
        if (modelType === ModelType.POTATO_LEAF) return ImagePrefix.POTATO_LEAF
        if (modelType === ModelType.TOMATO_LEAF) return ImagePrefix.TOMATO_LEAF
    }
}
