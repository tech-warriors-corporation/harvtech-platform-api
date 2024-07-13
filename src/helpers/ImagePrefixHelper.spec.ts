import { ImagePrefixHelper } from './ImagePrefixHelper'

import { ImagePrefix } from '~enums/ImagePrefix'
import { ModelType } from '~enums/ModelType'

describe('ImagePrefixHelper', () => {
    describe('getImagePrefixFromModelType', () => {
        it(`Should return the correct prefix for ${ModelType.RICE_LEAF}`, () => {
            expect(ImagePrefixHelper.getImagePrefixFromModelType(ModelType.RICE_LEAF)).toBe(ImagePrefix.RICE_LEAF)
        })

        it('Should return nothing for an invalid ModelType', () => {
            expect(ImagePrefixHelper.getImagePrefixFromModelType('INVALID_MODEl_TYPE' as ModelType)).toBeFalsy()
        })
    })
})
