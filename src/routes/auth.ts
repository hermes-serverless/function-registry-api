import { Logger } from './../utils/Logger'
import { Router } from 'express'
import config from '../jwtConfig'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '../db'
import { RouteError, NoSuchUser } from './errors/RouteError'

const authRouter = Router()

const TOKEN_EXPIRATION = 86400

export const getToken = (userId: number, username: string): string => {
  return jwt.sign({ id: userId, username }, config.secret, { expiresIn: TOKEN_EXPIRATION })
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
    const token = getToken(user.id, user.username)
    return token
  } catch (err) {
    console.log('ERROR', err)
    Logger.error('Error on register user', err)
    throw err
  }
}

export const login = async ({ username, password }: LoginData): Promise<string> => {
  const user = await db.User.findOne({ where: { username } })
  if (!user) throw new NoSuchUser('User or password incorrect', 401)
  const passwordIsValid = bcrypt.compareSync(password, user.password)
  if (!passwordIsValid) return ''
  return getToken(user.id, user.username)
}

authRouter.all('/register', async (req, res, next) => {
  if (req.method !== 'POST') {
    res.status(400).send('This route only accepts POST requests')
    return
  }

  try {
    if (!req.body.username || !req.body.password)
      throw new RouteError('Missing username or password on body', 400)

    const loginData = {
      username: req.body.username,
      password: req.body.password,
    }

    const token = await registerUser(loginData)
    res.status(200).send({ auth: true, token })
  } catch (err) {
    next(err)
  }
})

authRouter.all('/me', (req, res) => {
  const token = req.headers['x-access-token'] as string
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' })
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' })
    res.status(200).send(decoded)
  })
})

authRouter.all('/login', async (req, res, next) => {
  if (req.method !== 'POST') {
    res.status(400).send('This route only accepts POST requests')
    return
  }

  try {
    if (!req.body.username || !req.body.password)
      throw new RouteError('Missing username or password on body', 400)

    const loginData = {
      username: req.body.username,
      password: req.body.password,
    }

    const token = await login(loginData)
    if (!token) res.status(401).send({ auth: false, token: null })
    else res.status(200).send({ auth: true, token })
  } catch (err) {
    next(err)
  }
})

export { authRouter }
