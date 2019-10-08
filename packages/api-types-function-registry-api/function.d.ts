import { SimplifiedUser } from './user'

export interface FunctionData {
  id: string
  ownerId: string
  language: string
  functionName: string
  gpuCapable: boolean
  scope: string
  imageName: string
  functionVersion: string
  updatedAt: string
  createdAt: string
}

export interface FunctionDataWithOwner extends FunctionData {
  owner: { username: string }
}

export interface FunctionGetObj {
  user: SimplifiedUser
  functions: FunctionDataWithOwner[]
}

export interface FunctionDeleteObj {
  user: SimplifiedUser
  deletedFunctions: FunctionDataWithOwner[]
}

export interface FunctionPostObj {
  user: SimplifiedUser
  newFunction: FunctionData[]
}

export interface FunctionPutObj {
  user: SimplifiedUser
  updatedFunctions: FunctionDataWithOwner[]
}
