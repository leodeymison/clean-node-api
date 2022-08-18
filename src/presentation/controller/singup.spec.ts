import { SignUpController } from './singup'
import { InvalidParamError, MissingParamError, ServerError } from '../error'
import { EmailValidation } from '../protocols'

interface SutType {
  sut: SignUpController
  emailValidatorStub: EmailValidation
}

const makeEmailValidator = (): EmailValidation => {
  class EmailValidatorStub implements EmailValidation {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut, emailValidatorStub
  }
}

describe('SingUp controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'nome@gmail.com',
        password: 'nome_password',
        password_confirmation: 'nome_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'nome',
        password: 'nome_password',
        password_confirmation: 'nome_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'nome',
        email: 'nome@gmail.com',
        password_confirmation: 'nome_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  test('Should return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'nome',
        email: 'nome@gmail.com',
        password: 'nome_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password_confirmation'))
  })
  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false) // espionar o méthod isValid e muda o retorno
    const httpRequest = {
      body: {
        name: 'nome',
        email: 'invalid_email@gmail.com',
        password: 'nome_password',
        password_confirmation: 'nome_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  test('Should call EmailValidator whith correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'nome',
        email: 'any_email@gmail.com',
        password: 'nome_password',
        password_confirmation: 'nome_password'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com') // Quero que seja chamado com esse email
  })
  test('Should return 500 if Email validator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'nome',
        email: 'any_email@gmail.com',
        password: 'nome_password',
        password_confirmation: 'nome_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
