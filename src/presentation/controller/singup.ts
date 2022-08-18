import { HttpResponse, HttpRequest, Controller, EmailValidation } from '../protocols'
import { InvalidParamError, MissingParamError } from '../error'
import { badRequest, serverError } from '../helpers'

export class SignUpController implements Controller {
  private readonly emailValidor: EmailValidation

  constructor (emailValidor: EmailValidation) {
    this.emailValidor = emailValidor
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'password_confirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { password, password_confirmation, email } = httpRequest.body
      if (password !== password_confirmation) {
        return badRequest(new InvalidParamError('password_confirmation'))
      }
      const isValid = this.emailValidor.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
