import { Encrypter } from './db-add-account-protocols'
import { DBAddAccount } from './db-add-account'

interface SutTypes {
    sut: DBAddAccount
    encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt (value: string): Promise<string> {
            return await new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new EncrypterStub()
}

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter()
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
    test('Should throw if encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        )
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@gmail.com',
            password: 'valid_password'
        }
        const promise = sut.add(accountData)
        await expect(promise).rejects.toThrow()
    })
})
