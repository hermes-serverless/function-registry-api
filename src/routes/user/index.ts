import { Router } from 'express'
import { writeFnOnReq, handleAllFunctions, handleOneFunction } from './functionHandlers'
import { writeUserOnReq, handleAllUsers, handleOneUser } from './userHandlers'

const userRouter = Router()

userRouter.all('/:userId', [writeUserOnReq, handleOneUser])
userRouter.all('/:userId/function/:functionName', [writeUserOnReq, writeFnOnReq, handleOneFunction])
userRouter.all('/:userId/function', [writeUserOnReq, handleAllFunctions])
userRouter.all('/', handleAllUsers)

export { userRouter }
