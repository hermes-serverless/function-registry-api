import { Router } from 'express'
import { handleRegister, handleLogin, handleGetMe } from './handlers'

const authRouter = Router()

authRouter.all('/register', handleRegister)
authRouter.all('/login', handleLogin)
authRouter.all('/me', handleGetMe)

export { authRouter }
