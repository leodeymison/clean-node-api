import { EmailValidation } from '../presentation/protocols/email-validator'

export class EmailValidationAdapter implements EmailValidation {
  isValid (email: string): boolean {
    return false
  }
}
