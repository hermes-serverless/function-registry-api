import { Router } from 'express'
import { handleGetMe, handleLogin, handleRegister, handleUsernameExists } from './handlers'

const authRouter = Router()

authRouter.all('/register', handleRegister)
authRouter.all('/register/:username', handleUsernameExists)
authRouter.all('/login', handleLogin)
authRouter.all('/me', handleGetMe)

export { authRouter }
