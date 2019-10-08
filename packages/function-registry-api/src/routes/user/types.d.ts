import { Request } from 'express'
import { HermesFunction, Run, User } from '../../db'

export interface ReqWithUser extends Request {
  user: User
}

export interface ReqWithFn extends ReqWithUser {
  fnArr: HermesFunction[]
}

export interface ReqWithRun extends ReqWithUser {
  runArr: Run[]
  fn?: HermesFunction
}
