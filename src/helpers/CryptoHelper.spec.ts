import { CryptoHelper } from './CryptoHelper'

describe('CryptoHelper', () => {
    let cryptoHelper: CryptoHelper

    beforeEach(() => {
        cryptoHelper = new CryptoHelper()
    })

    describe('Encrypt', () => {
        it('Should encrypt a text', () => {
            const text = 'HarvTech'

            expect(cryptoHelper.encrypt(text)).toBeTruthy()
        })
    })

    describe('Decrypt', () => {
        it('Should decrypt a hash', () => {
            const text = 'HarvTech'
            const hash = cryptoHelper.encrypt(text)

            expect(cryptoHelper.decrypt(hash)).toBe(text)
        })
    })

    describe('Compare', () => {
        it('Should compare a text with a hash and return if is equal', () => {
            const text = 'HarvTech'
            const hash = cryptoHelper.encrypt(text)

            expect(cryptoHelper.compare(text, hash)).toBe(true)
        })
    })
})
