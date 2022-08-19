import {
  HttpResponse,
  HttpRequest,
  Controller,
  EmailValidation,
  AddAccount,
  AccountModel
} from './singup-protocols'
import { InvalidParamError, MissingParamError } from '../../error'
import { badRequest, ok, serverError } from '../../helpers'

export class SignUpController implements Controller {
  private readonly emailValidor: EmailValidation
  private readonly addAccount: AddAccount

  constructor (emailValidor: EmailValidation, addAccount: AddAccount) {
    this.emailValidor = emailValidor
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'password_confirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, password, password_confirmation, email } = httpRequest.body
      if (password !== password_confirmation) {
        return badRequest(new InvalidParamError('password_confirmation'))
      }
      const isValid = this.emailValidor.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = this.addAccount.add({
        name, email, password
      })
      return ok<AccountModel>(account)
    } catch (error) {
      return serverError()
    }
  }
}
