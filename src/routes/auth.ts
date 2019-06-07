import { Logger } from './../utils/Logger'
import { Router } from 'express'
import config from '../jwtConfig'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '../db'

const authRouter = Router()

const TOKEN_EXPIRATION = 86400

export const getToken = (userId: number): string => {
  return jwt.sign({ id: userId }, config.secret, { expiresIn: TOKEN_EXPIRATION })
}

export const hashPassword = (password: string): string => bcrypt.hashSync(password, 8)

export interface LoginData {
  username: string
  password: string
}

export const registerUser = async ({ username, password }: LoginData) => {
  try {
    const user = await db.User.create({
      username: username,
      password: hashPassword(password),
    })
    const token = getToken(user.id)
    return token
  } catch (err) {
    console.log('ERROR', err)
    Logger.error('Error on register user', err)
    throw err
  }
}

export const login = async ({ username, password }: LoginData): Promise<string> => {
  const user = await db.User.findOne({ where: { username } })
  const passwordIsValid = bcrypt.compareSync(password, user.password)
  if (!passwordIsValid) return ''
  return getToken(user.id)
}

authRouter.post('/register', async (req, res) => {
  const loginData = {
    username: req.body.username,
    password: req.body.password,
  }

  try {
    const token = registerUser(loginData)
    res.status(200).send({ auth: true, token })
  } catch (err) {
    Logger.error('Error on auth/register', err)
  }
})

authRouter.get('/me', (req, res) => {
  const token = req.headers['x-access-token'] as string
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' })
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' })
    res.status(200).send(decoded)
  })
})

authRouter.post('/login', async (req, res) => {
  const loginData = {
    username: req.body.username,
    password: req.body.password,
  }

  try {
    const token = login(loginData)
    if (!token) res.status(401).send({ auth: false, token: null })
    else res.status(200).send({ auth: true, token })
  } catch (err) {
    Logger.error('Error on auth/login', err)
  }
})

export { authRouter }
