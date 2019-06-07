import * as UserDef from './User'
import * as HermesFunctionDef from './HermesFunction'
import * as HermesRunDef from './HermesRun'
import * as HermesRunResultDef from './HermesRunResult'
import { ModelInitializerConstructor } from './ModelInitizalizer'

interface DefImport {
  Initializer: ModelInitializerConstructor
}

export interface HermesModels {
  User: typeof UserDef.User
  HermesFunction: typeof HermesFunctionDef.HermesFunction
  HermesRun: typeof HermesRunDef.HermesRun
  HermesRunResult: typeof HermesRunResultDef.HermesRunResult
}

export const models: HermesModels = {
  User: UserDef.User,
  HermesFunction: HermesFunctionDef.HermesFunction,
  HermesRun: HermesRunDef.HermesRun,
  HermesRunResult: HermesRunResultDef.HermesRunResult,
}

const definitions: DefImport[] = [UserDef, HermesFunctionDef, HermesRunDef, HermesRunResultDef]
export const modelInitializers = definitions.map(def => new def.Initializer())
