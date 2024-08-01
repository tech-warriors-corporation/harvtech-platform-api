import { ImagePrefixHelper } from './ImagePrefixHelper'

import { ImagePrefix } from '~enums/ImagePrefix'
import { ModelType } from '~enums/ModelType'

describe('ImagePrefixHelper', () => {
    describe('getImagePrefixFromModelType', () => {
        it(`Should return the correct prefix for ${ModelType.RICE_LEAF}`, () => {
            expect(ImagePrefixHelper.getImagePrefixFromModelType(ModelType.RICE_LEAF)).toBe(ImagePrefix.RICE_LEAF)
        })

        it(`Should return the correct prefix for ${ModelType.BEAN_LEAF}`, () => {
            expect(ImagePrefixHelper.getImagePrefixFromModelType(ModelType.BEAN_LEAF)).toBe(ImagePrefix.BEAN_LEAF)
        })

        it(`Should return the correct prefix for ${ModelType.TOMATO_LEAF}`, () => {
            expect(ImagePrefixHelper.getImagePrefixFromModelType(ModelType.TOMATO_LEAF)).toBe(ImagePrefix.TOMATO_LEAF)
        })

        it(`Should return the correct prefix for ${ModelType.POTATO_LEAF}`, () => {
            expect(ImagePrefixHelper.getImagePrefixFromModelType(ModelType.POTATO_LEAF)).toBe(ImagePrefix.POTATO_LEAF)
        })

        it('Should return nothing for an invalid ModelType', () => {
            expect(ImagePrefixHelper.getImagePrefixFromModelType('INVALID_MODEl_TYPE' as ModelType)).toBeFalsy()
        })
    })
})
