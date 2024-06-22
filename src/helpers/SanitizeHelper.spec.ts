import { SanitizeHelper } from './SanitizeHelper'

describe('SanitizeHelper', () => {
    describe('input', () => {
        it('Should return a sanitized string', () => {
            // eslint-disable-next-line
            expect(SanitizeHelper.input("HarvTech'; DROP TABLE accounts;--")).toBe('HarvTech DROP TABLE accounts--')
            expect(SanitizeHelper.input('HarvTech <script>alert("XSS")</script>')).toBe(
                'HarvTech scriptalert(XSS)&#x2F;script',
            )
            expect(SanitizeHelper.input('   HarvTech HarvTech   ')).toBe('HarvTech HarvTech')
        })
    })
})
