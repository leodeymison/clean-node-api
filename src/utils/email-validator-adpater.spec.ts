import { EmailValidationAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
    isEmail (): boolean {
        return true
    }
}))

const makeSut = (): EmailValidationAdapter => {
    return new EmailValidationAdapter()
}

describe('EmailValidor Adapter', () => {
    test('Should return false if EmailValidation return false', () => {
        const sut = makeSut()
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const isValid = sut.isValid('invalid_email@gmail.com')
        expect(isValid).toBe(false)
    })
    test('Should return true if EmailValidation return true', () => {
        const sut = makeSut()
        const isValid = sut.isValid('valid_email@gmail.com')
        expect(isValid).toBe(true)
    })
    test('Should call validator with a email correct', () => {
        const sut = makeSut()
        const isEmailSpy = jest.spyOn(validator, 'isEmail')
        sut.isValid('any_email@gmail.com')
        expect(isEmailSpy).toHaveBeenCalledWith('any_email@gmail.com')
    })
})
