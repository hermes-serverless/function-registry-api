import * as HermesFunctionDef from './HermesFunction'
import { ModelInitializerConstructor } from './ModelInitizalizer'
import * as RunDef from './Run'
import * as UserDef from './User'

interface DefImport {
  Initializer: ModelInitializerConstructor
}

export interface HermesModels {
  User: typeof UserDef.User
  HermesFunction: typeof HermesFunctionDef.HermesFunction
  Run: typeof RunDef.Run
}

export const models: HermesModels = {
  User: UserDef.User,
  HermesFunction: HermesFunctionDef.HermesFunction,
  Run: RunDef.Run,
}

const definitions: DefImport[] = [UserDef, HermesFunctionDef, RunDef]
export const modelInitializers = definitions.map(def => new def.Initializer())

export { HermesFunction } from './HermesFunction'
export { Run } from './Run'
export { User } from './User'
