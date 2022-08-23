import { AddAccount, AddAccountModel } from '../../../domain/usecases'
import { AccountModel } from '../../../domain/entities'
import { Encrypter } from '../../protocols'

export class DBAddAccount implements AddAccount {
    private readonly encrypter: Encrypter

    constructor (encrypter: Encrypter) {
        this.encrypter = encrypter
    }

    async add (account: AddAccountModel): Promise<AccountModel> {
        await this.encrypter.encrypt(account.password)
        return await new Promise(resolve => resolve(null))
    }
}
