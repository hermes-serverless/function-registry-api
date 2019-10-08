import { pickBy } from 'ramda'
import { ValidationError as SequelizeValidationError } from 'sequelize/types'
import { db } from '../../db'
import { User } from './../../db/models/definitions/User'
import { NoSuchFunction, NoSuchUser, ValidationError } from './../errors/RouteError'
import { ReqWithUser } from './types'

export const getUser = async (username: string) => {
  const user = await db.User.findOne({
    where: { username },
    attributes: { exclude: ['password'] },
  })
  if (!user) {
    throw new NoSuchUser({
      msg: `No user with username ${username}`,
      errorName: 'NoSuchUser',
      statusCode: 404,
    })
  }
  return user
}

export const getFunctionArr = async (user: User, functionName?: string, functionVersion?: string) => {
  const fnArr = await user.getFunctions({
    where: {
      ...(functionName ? { functionName } : {}),
      ...(functionVersion ? { functionVersion } : {}),
    },
    include: [
      {
        model: User,
        attributes: { exclude: ['password', 'id', 'createdAt', 'updatedAt'] },
        as: 'owner',
      },
    ],
  })

  if (functionName && fnArr.length === 0) {
    const fmsg = functionName + (functionVersion ? `:${functionVersion}` : '')
    throw new NoSuchFunction({
      msg: `No function ${fmsg} for user ${user.username}`,
      errorName: 'NoSuchFunction',
      statusCode: 404,
    })
  }

  return fnArr
}

export const checkValidation = (err: Error, msg?: string) => {
  if (err.name === 'SequelizeValidationError') {
    throw new ValidationError('Invalid fields', 400, err as SequelizeValidationError)
  }
}

export const createResponseObject = (req: ReqWithUser, res: any) => {
  return {
    user: req.user.toJSON(),
    ...res,
  }
}

export const excludeAttributes = (obj: object, exclude: string[]) => {
  return pickBy((val, key) => !exclude.includes(key), obj)
}
