import { Encrypter } from '../../protocols'
import { DBAddAccount } from './db-add-account'

interface SutTypes {
    sut: DBAddAccount
    encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
    class EncrypterStub {
        async encrypt (value: string): Promise<string> {
            return await new Promise(resolve => resolve('hashed_password'))
        }
    }
    const encrypterStub = new EncrypterStub()
    const sut = new DBAddAccount(encrypterStub)
    return {
        sut,
        encrypterStub
    }
}

describe('DbAddAccount usecase', () => {
    test('Should call encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@gmail.com',
            password: 'valid_password'
        }
        await sut.add(accountData)
        expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
    })
})
