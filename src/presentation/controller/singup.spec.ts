import { SignUpController } from './singup'

describe('SingUp controller', () => {
  test('Should return 400 if no name id provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'nome@gmail.com',
        password: 'nome_password',
        password_confirmation: 'nome_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
