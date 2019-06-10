import { Router } from 'express'
import { writeFnOnReq, handleAllFunctions, handleOneFunction } from './functionHandlers'
import { writeUserOnReq, handleAllUsers, handleOneUser } from './userHandlers'

const userRouter = Router()

userRouter.all('/:username', [writeUserOnReq, handleOneUser])
userRouter.all('/:username/function/:functionName', [
  writeUserOnReq,
  writeFnOnReq,
  handleOneFunction,
])
userRouter.all('/:username/function', [writeUserOnReq, handleAllFunctions])
userRouter.all('/', handleAllUsers)

export { userRouter }
