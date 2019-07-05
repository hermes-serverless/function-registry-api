import { Router } from 'express'
import {
  AllFunctionsOps,
  OneFunctionOps,
  OneFunctionVersionOps,
  writeFnOnReq,
} from './functionHandlers'
import { BaseRunHandler, OneRunHandler, RunCreatorHandler, writeRunOnReq } from './runHandlers'
import { AllUsersOps, OneUserOps, writeUserOnReq } from './userHandlers'

const userRouter = Router()

userRouter.all('/', AllUsersOps.handler)
userRouter.all('/:username', [writeUserOnReq, writeFnOnReq, OneUserOps.handler])

userRouter.all('/:username/function', [writeUserOnReq, writeFnOnReq, AllFunctionsOps.handler])
userRouter.all('/:username/function/:functionName', [
  writeUserOnReq,
  writeFnOnReq,
  OneFunctionOps.handler,
])
userRouter.all('/:username/function/:functionName/:functionVersion', [
  writeUserOnReq,
  writeFnOnReq,
  OneFunctionVersionOps.handler,
])

userRouter.all('/:username/runs/', [writeUserOnReq, writeRunOnReq, BaseRunHandler.handler])
userRouter.all('/:username/runs/:runId', [writeUserOnReq, writeRunOnReq, OneRunHandler.handler])

userRouter.all('/:username/function-runs/:functionOwner/', [
  writeUserOnReq,
  writeRunOnReq,
  BaseRunHandler.handler,
])
userRouter.all('/:username/function-runs/:functionOwner/:functionName/', [
  writeUserOnReq,
  writeRunOnReq,
  BaseRunHandler.handler,
])
userRouter.all('/:username/function-runs/:functionOwner/:functionName/:functionVersion', [
  writeUserOnReq,
  writeRunOnReq,
  RunCreatorHandler.handler,
])

export { userRouter }
