import { AccountModel } from '../entities'

export interface AddAccountModel {
  name: string
  email: string
  password: string
}
export interface AddAccount {
  add: (account: AddAccountModel) => AccountModel
}
