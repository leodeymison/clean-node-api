import { HttpResponse, HttpRequest, Controller, EmailValidation } from '../protocols'
import { InvalidParamError, MissingParamError } from '../error'
import { badRequest } from '../helpers'

export class SignUpController implements Controller {
  private readonly emailValidor: EmailValidation

  constructor (emailValidor: EmailValidation) {
    this.emailValidor = emailValidor
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'password_confirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const isValid = this.emailValidor.isValid(httpRequest.body.email)
    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}
