import { NextFunction, Response } from 'express'
import { db } from '../../db'
import { FunctionAlreadyExists, NoSuchFunction } from '../errors/RouteError'
import { HermesFunction } from './../../db/models/definitions/HermesFunction'
import { Logger } from './../../utils/Logger'
import { ReqWithFn } from './types.d'
import { checkValidation, createResponseObject } from './utils'

const checkUniqueConstraint = (err: Error, msg?: string) => {
  if (err.name === 'SequelizeUniqueConstraintError') throw new FunctionAlreadyExists(msg)
}

export const writeFnOnReq = async (req: ReqWithFn, res: Response, next: NextFunction) => {
  try {
    const functionName = req.params.functionName
    const functionVersion = req.params.functionVersion
    const fnArr = await req.user.getFunctions({
      where: {
        ...(functionName ? { functionName } : {}),
        ...(functionVersion ? { functionVersion } : {}),
      },
    })

    if (functionName && fnArr.length === 0) {
      const fmsg = functionName + (functionVersion ? `:${functionVersion}` : '')
      throw new NoSuchFunction({
        msg: `No function ${fmsg} for user ${req.user.username}`,
        errorName: 'NoSuchFunction',
        statusCode: 404,
      })
    }
    req.fnArr = fnArr
    next()
  } catch (err) {
    next(err)
  }
}

export class OneFunctionVersionOps {
  public static async handler(req: ReqWithFn, res: Response, next: NextFunction) {
    try {
      const ops = new OneFunctionVersionOps(req)
      if (req.method === 'DELETE') {
        const deletedFunctions = [(await ops.del()).toJSON()]
        res.status(200).send(createResponseObject(req, { deletedFunctions }))
      } else if (req.method === 'GET') {
        const fn = [(await ops.get()).toJSON()]
        res.status(200).send(createResponseObject(req, { functions: fn }))
      } else if (req.method === 'PUT') {
        const updatedFunctions = [(await ops.upd()).toJSON()]
        res.status(200).send(createResponseObject(req, { updatedFunctions }))
      } else {
        res.status(400).send('This route only accepts DELETE, GET or PUT requests')
        return
      }
    } catch (err) {
      next(err)
    }
  }

  req: ReqWithFn
  constructor(req: ReqWithFn) {
    this.req = req
  }

  public del = async (): Promise<HermesFunction> => {
    await this.req.fnArr[0].destroy()
    return this.req.fnArr[0]
  }

  public upd = async (): Promise<HermesFunction> => {
    const { functionName, language, gpuCapable, scope, imageName, functionVersion } = this.req.body
    try {
      const fn = await this.req.fnArr[0].set({
        ...(functionName != null ? { functionName } : {}),
        ...(functionVersion != null ? { functionVersion } : {}),
        ...(language != null ? { language } : {}),
        ...(gpuCapable != null ? { gpuCapable } : {}),
        ...(scope != null ? { scope } : {}),
        ...(imageName != null ? { imageName } : {}),
      })
      await fn.save()
      return this.req.fnArr[0]
    } catch (err) {
      Logger.error('Error on update OneFunctionVersion\n', err)
      checkUniqueConstraint(err)
      checkValidation(err)
      throw err
    }
  }

  public get = (): HermesFunction => {
    return this.req.fnArr[0]
  }
}

export class OneFunctionOps {
  public static handler = async (req: ReqWithFn, res: Response, next: NextFunction) => {
    try {
      const ops = new OneFunctionOps(req)
      if (req.method === 'DELETE') {
        const deletedFunctions = (await ops.del()).map(fn => fn.toJSON())
        res.status(200).send(createResponseObject(req, { deletedFunctions }))
      } else if (req.method === 'GET') {
        const functions = (await ops.get()).map(fn => fn.toJSON())
        res.status(200).send(createResponseObject(req, { functions }))
      } else if (req.method === 'PUT') {
        const updatedFunctions = (await ops.upd()).map(fn => fn.toJSON())
        res.status(200).send(createResponseObject(req, { updatedFunctions }))
      } else {
        res.status(400).send('This route only accepts DELETE, GET or PUT requests')
        return
      }
    } catch (err) {
      next(err)
    }
  }

  req: ReqWithFn
  constructor(req: ReqWithFn) {
    this.req = req
  }

  public del = async (): Promise<HermesFunction[]> => {
    const deleteArr = await this.req.fnArr.map(fn => fn.destroy())
    await Promise.all(deleteArr)
    return this.req.fnArr
  }

  public upd = async () => {
    const { functionName, scope } = this.req.body
    const transaction = await db.sequelize.transaction()
    try {
      const updArr = this.req.fnArr.map(fn =>
        fn.set({
          ...(functionName != null ? { functionName } : {}),
          ...(scope != null ? { scope } : {}),
        })
      )
      await Promise.all(updArr)
      const saveArr = updArr.map(fn => fn.save({ transaction }))
      const ret = await Promise.all(saveArr)
      await transaction.commit()
      return ret
    } catch (err) {
      Logger.error('Error on update OneFunction\n', err)
      await transaction.rollback()
      checkUniqueConstraint(err, 'After renaming this function a version conflict will appear')
      checkValidation(err)
      throw err
    }
  }

  public get = (): HermesFunction[] => {
    return this.req.fnArr
  }
}

export class AllFunctionsOps {
  public static async handler(req: ReqWithFn, res: Response, next: NextFunction) {
    try {
      const ops = new AllFunctionsOps(req)
      if (req.method === 'DELETE') {
        const deletedFunctions = (await ops.del()).map(fn => fn.toJSON())
        res.status(200).send(createResponseObject(req, { deletedFunctions }))
      } else if (req.method === 'GET') {
        const functions = (await ops.get()).map(fn => fn.toJSON())
        res.status(200).send(createResponseObject(req, { functions }))
      } else if (req.method === 'POST') {
        const newFunction = [(await ops.create()).toJSON()]
        res.status(200).send(createResponseObject(req, { newFunction }))
      } else {
        res.status(400).send('This route only accepts DELETE, GET or POST requests')
        return
      }
    } catch (err) {
      next(err)
    }
  }

  req: ReqWithFn
  constructor(req: ReqWithFn) {
    this.req = req
  }

  public create = async (): Promise<HermesFunction> => {
    const { functionName, language, gpuCapable, scope, imageName, functionVersion } = this.req.body
    try {
      const newFunction = await db.HermesFunction.build({
        functionName,
        language,
        gpuCapable,
        scope,
        imageName,
        functionVersion,
        ownerId: this.req.user.id,
      })
      await newFunction.save()
      return newFunction
    } catch (err) {
      Logger.error('Error on create AllFunction\n', err)
      checkUniqueConstraint(err)
      checkValidation(err)
      throw err
    }
  }

  public get = (): HermesFunction[] => {
    return this.req.fnArr
  }

  public del = async (): Promise<HermesFunction[]> => {
    const deleteArr = this.req.fnArr.map(fn => fn.destroy())
    await Promise.all(deleteArr)
    return this.req.fnArr
  }
}
