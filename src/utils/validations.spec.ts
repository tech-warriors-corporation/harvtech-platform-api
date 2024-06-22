import { isValidPassword } from './validations'

describe('Validations', () => {
    describe('isValidPassword', () => {
        it('Should return false if password is invalid', () => {
            expect(isValidPassword('1234')).toBe(false)
            expect(isValidPassword('1234!')).toBe(false)
            expect(isValidPassword('12345678')).toBe(false)
            expect(isValidPassword('12345678!')).toBe(false)
            expect(isValidPassword('abcd')).toBe(false)
            expect(isValidPassword('abcd!')).toBe(false)
            expect(isValidPassword('abcdefgh')).toBe(false)
            expect(isValidPassword('abcdefgh!')).toBe(false)
            expect(isValidPassword('abcd1234')).toBe(false)
            expect(isValidPassword('abcd1234!')).toBe(false)
            expect(isValidPassword('ABCD')).toBe(false)
            expect(isValidPassword('ABCDEFGH')).toBe(false)
            expect(isValidPassword('ABCDEFGH!')).toBe(false)
            expect(isValidPassword('ABCD1234')).toBe(false)
            expect(isValidPassword('ABCD1234!')).toBe(false)
            expect(isValidPassword('Abcd1234')).toBe(false)
            expect(isValidPassword('Abcdedfgh!')).toBe(false)
        })

        it('Should return true if password is valid', () => {
            expect(isValidPassword('Abcd123!')).toBe(true)
        })
    })
})
