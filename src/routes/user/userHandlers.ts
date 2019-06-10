import { Logger } from './../../utils/Logger'
import { Request, Response, NextFunction } from 'express'
import { db, User } from '../../db'
import { NoSuchUser, RouteError, ValidationError } from '../errors/RouteError'
import { ReqWithUser } from './types'

const getAllUsers = async (req: ReqWithUser): Promise<User[]> => {
  const userArr = await db.User.findAll({ attributes: { exclude: ['password'] } })
  return userArr
}

const deleteOneUser = async (req: ReqWithUser): Promise<User> => {
  await req.user.destroy()
  return req.user
}

const updateUser = async (req: ReqWithUser): Promise<User> => {
  try {
    const user = await req.user.set({
      ...(req.body.username != null ? { username: req.body.username } : {}),
    })

    await user.save()
    return user
  } catch (err) {
    Logger.error('Error on update user\n', err)
    if (err.name === 'SequelizeUniqueConstraintError')
      throw new RouteError({
        msg: `User ${req.body.username} already exists`,
        errorName: 'UserAlreadyExists',
        statusCode: 409,
      })

    if (err.name === 'SequelizeValidationError')
      throw new ValidationError('Invalid fields', 400, err)

    throw err
  }
}

export const writeUserOnReq = async (req: ReqWithUser, res: Response, next: NextFunction) => {
  try {
    const user = await db.User.findOne({
      where: { username: req.params.username },
      attributes: { exclude: ['password'] },
    })
    if (!user)
      throw new NoSuchUser({
        msg: `No user with username ${req.params.username}`,
        errorName: 'NoSuchUser',
        statusCode: 404,
      })
    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

export const handleOneUser = async (req: ReqWithUser, res: Response, next: NextFunction) => {
  try {
    if (req.method == 'GET') {
      res.status(200).send({ user: req.user.toJSON() })
    } else if (req.method == 'PUT') {
      const updUser = (await updateUser(req)).toJSON()
      res.status(200).send({ updatedUser: updUser })
    } else if (req.method == 'DELETE') {
      const deletedUser = (await deleteOneUser(req)).toJSON()
      res.status(200).send({ deletedUser })
    } else {
      res.status(400).send('This route only accepts GET, PUT or DELETE requests')
      return
    }
  } catch (err) {
    next(err)
  }
}

export const handleAllUsers = async (req: ReqWithUser, res: Response, next: NextFunction) => {
  try {
    if (req.method == 'GET') {
      const userArr = await getAllUsers(req)
      res.status(200).send({ users: userArr.map(el => el.toJSON()) })
    } else {
      res.status(400).send('This route only accepts GET requests')
      return
    }
  } catch (err) {
    next(err)
  }
}
