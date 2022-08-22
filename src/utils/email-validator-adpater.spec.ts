import { EmailValidationAdapter } from './email-validator-adapter';

describe('EmailValidor Adapter', () => {
    test('Should return false if EmailValidation return false', () => {
        const sut = new EmailValidationAdapter()
        const isValid = sut.isValid('invalid_email@gmail.com')
        expect(isValid).toBe(false)
    })
})
