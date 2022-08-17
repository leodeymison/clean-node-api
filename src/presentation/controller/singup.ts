import { HttpResponse, HttpRequest, Controller } from '../protocols'
import { MissingParamError } from '../error'
import { badRequest } from '../helpers'

export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'password_confirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
