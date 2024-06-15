import { ErrorHelper } from './ErrorHelper'

describe('ErrorHelper', () => {
    describe('createErrorModel', () => {
        it('Should return an error model with provided error message', () => {
            const message = 'Error message'
            const errorModel = ErrorHelper.createErrorModel(message)

            expect(errorModel).toEqual({ error: { message } })
        })
    })
})
