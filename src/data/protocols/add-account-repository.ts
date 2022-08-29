import { AccountModel } from '../../domain/entities'
import { AddAccountModel } from '../../domain/usecases'

export interface AddAccountRepository {
    add: (accountData: AddAccountModel) => Promise<AccountModel>
}
