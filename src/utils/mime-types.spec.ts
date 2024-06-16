import { imageMimeTypes } from './mime-types'

describe('MIME types', () => {
    describe('Images', () => {
        it('Should have the JPG MIME type', () => {
            expect(imageMimeTypes.jpg).toBe('image/jpeg')
        })

        it('Should have the JPEG MIME type', () => {
            expect(imageMimeTypes.jpeg).toBe('image/jpeg')
        })

        it('Should have the PNG MIME type', () => {
            expect(imageMimeTypes.png).toBe('image/png')
        })
    })
})
