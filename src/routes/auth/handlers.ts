import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { db } from '../../db'
import config from '../../jwtConfig'
import { Logger } from '../../utils/Logger'
import { NoSuchUser, RouteError, ValidationError } from '../errors/RouteError'
import { LoginData } from './types'

const TOKEN_EXPIRATION = 86400

export const hashPassword = (password: string): string => bcrypt.hashSync(password, 8)

const getToken = (userId: number, username: string): string => {
  return jwt.sign({ username, id: userId }, config.secret, { expiresIn: TOKEN_EXPIRATION })
}

const registerUser = async ({ username, password }: LoginData): Promise<string> => {
  try {
    const user = await db.User.create({
      username,
      password: hashPassword(password),
    })
    const token = getToken(user.id, user.username)
    return token
  } catch (err) {
    Logger.error('Error on register user\n', err)
    if (err.name === 'SequelizeUniqueConstraintError') {
      throw new RouteError({
        msg: `User ${username} already exists`,
        errorName: 'UserAlreadyExists',
        statusCode: 409,
      })
    }

    if (err.name === 'SequelizeValidationError') {
      throw new ValidationError('Invalid fields', 400, err)
    }

    throw err
  }
}

const usernameExists = async (username: string): Promise<boolean> => {
  const user = await db.User.findOne({ where: { username } })
  return user != null
}

const login = async ({ username, password }: LoginData): Promise<string> => {
  const user = await db.User.findOne({ where: { username } })
  if (!user) {
    throw new NoSuchUser({
      errorName: 'AuthenticationError',
      msg: 'User or password incorrect',
      statusCode: 401,
    })
  }
  const passwordIsValid = bcrypt.compareSync(password, user.password)
  if (!passwordIsValid) return ''
  return getToken(user.id, user.username)
}

export const handleRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.method === 'POST') {
      if (!req.body.username || !req.body.password) {
        throw new RouteError({
          errorName: 'MissingArgument',
          msg: 'Missing username or password on body',
          statusCode: 400,
        })
      }

      const loginData = {
        username: req.body.username,
        password: req.body.password,
      }

      const token = await registerUser(loginData)
      res.status(200).send({ token, auth: true })
    } else {
      res.status(400).send('This route only accepts POST requests')
      return
    }
  } catch (err) {
    next(err)
  }
}

export const handleUsernameExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.method === 'POST') {
      const username = req.params.username
      const exists = await usernameExists(username)
      res.status(200).send({ username, exists })
    } else {
      res.status(400).send('This route only accepts POST requests')
      return
    }
  } catch (err) {
    next(err)
  }
}

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.method === 'POST') {
      if (!req.body.username || !req.body.password) {
        throw new RouteError({
          errorName: 'MissingArgument',
          msg: 'Missing username or password on body',
          statusCode: 400,
        })
      }

      const loginData = {
        username: req.body.username,
        password: req.body.password,
      }

      const token = await login(loginData)
      if (!token) {
        throw new RouteError({
          msg: 'Password or Username incorrect',
          errorName: 'AuthenticationError',
          statusCode: 401,
        })
      } else res.status(200).send({ token, auth: true })
    } else {
      res.status(400).send('This route only accepts POST requests')
      return
    }
  } catch (err) {
    next(err)
  }
}

export const handleGetMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.method === 'GET') {
      const fullAuthorization = req.headers['authorization'] as string
      if (!fullAuthorization) {
        throw new RouteError({
          errorName: 'AuthenticationError',
          msg: 'No token provided',
          statusCode: 401,
        })
      }

      const parts = fullAuthorization.split(' ')
      if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
        throw new RouteError({
          errorName: 'AuthenticationError',
          msg: "No token provided or another authorization method was used. Use 'Bearer token`",
          statusCode: 401,
        })
      } else {
        const token = parts[1]
        jwt.verify(token, config.secret, (err, decoded) => {
          if (err) {
            Logger.error('JsonWebTokenError thrown\n', err)
            throw new RouteError({
              errorName: 'AuthenticationError',
              msg: 'Invalid or expired token',
              statusCode: 401,
            })
          }
          res.status(200).send(decoded)
        })
      }
    } else {
      res.status(400).send('This route only accepts GET requests')
      return
    }
  } catch (err) {
    next(err)
  }
}
