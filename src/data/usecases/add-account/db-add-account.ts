import {
    AccountModel,
    AddAccount,
    AddAccountModel,
    AddAccountRepository,
    Encrypter
} from './db-add-account-protocols'

export class DBAddAccount implements AddAccount {
    private readonly encrypter: Encrypter
    private readonly addAccounRepository: AddAccountRepository

    constructor (encrypter: Encrypter, addAccounRepository: AddAccountRepository) {
        this.encrypter = encrypter
        this.addAccounRepository = addAccounRepository
    }

    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const hashedPassword = await this.encrypter.encrypt(accountData.password)
        const account = await this.addAccounRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
        return account
    }
}
