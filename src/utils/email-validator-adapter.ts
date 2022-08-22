import { EmailValidation } from '../presentation/protocols/email-validator'
import validator from 'validator'

export class EmailValidationAdapter implements EmailValidation {
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}
