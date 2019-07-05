import { NextFunction, Response } from 'express'
import { db, User } from '../../db'
import { RouteError, ValidationError } from '../errors/RouteError'
import { Logger } from './../../utils/Logger'
import { ReqWithUser } from './types'
import { getUser } from './utils'

export const writeUserOnReq = async (req: ReqWithUser, res: Response, next: NextFunction) => {
  try {
    const user = await getUser(req.params.username)
    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

export class OneUserOps {
  public static handler = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
      const ops = new OneUserOps(req)
      if (req.method === 'GET') {
        res.status(200).send({ user: ops.get().toJSON() })
      } else if (req.method === 'PUT') {
        const updUser = (await ops.upd()).toJSON()
        res.status(200).send({ updatedUser: updUser })
      } else if (req.method === 'DELETE') {
        const deletedUser = (await ops.del()).toJSON()
        res.status(200).send({ deletedUser })
      } else {
        res.status(400).send('This route only accepts GET, PUT or DELETE requests')
        return
      }
    } catch (err) {
      next(err)
    }
  }

  req: ReqWithUser
  constructor(req: ReqWithUser) {
    this.req = req
  }

  public del = async (): Promise<User> => {
    await this.req.user.destroy()
    return this.req.user
  }

  public upd = async (): Promise<User> => {
    const req = this.req
    const body = req.body
    try {
      const user = await this.req.user.set({
        ...(body.username != null ? { username: body.username } : {}),
      })

      await user.save()
      return user
    } catch (err) {
      Logger.error('Error on update user\n', err)
      if (err.name === 'SequelizeUniqueConstraintError') {
        throw new RouteError({
          msg: `User ${body.username} already exists`,
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

  public get = (): User => {
    return this.req.user
  }
}

export class AllUsersOps {
  public static handler = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
      const ops = new AllUsersOps(req)
      if (req.method === 'GET') {
        const userArr = await ops.get()
        res.status(200).send({ users: userArr.map(el => el.toJSON()) })
      } else {
        res.status(400).send('This route only accepts GET requests')
        return
      }
    } catch (err) {
      next(err)
    }
  }

  req: ReqWithUser
  constructor(req: ReqWithUser) {
    this.req = req
  }

  public get = async (): Promise<User[]> => {
    const userArr = await db.User.findAll({ attributes: { exclude: ['password'] } })
    return userArr
  }
}
