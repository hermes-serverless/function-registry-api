import { Request } from 'express'
import { User, HermesFunction } from '../../db'

export interface ReqWithUser extends Request {
  user: User
}

export interface ReqWithFn extends ReqWithUser {
  fn: HermesFunction
}
