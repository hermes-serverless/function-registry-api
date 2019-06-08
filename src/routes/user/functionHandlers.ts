import { Logger } from './../../utils/Logger'
import { Request, Response, NextFunction } from 'express'
import { db, HermesFunction } from '../../db'
import { NoSuchFunction } from '../errors/RouteError'
import { ReqWithUser, ReqWithFn } from './types'

const getAllFunctions = async (req: ReqWithUser): Promise<HermesFunction[]> => {
  const fnArr = await req.user.getFunction()
  return fnArr
}

const deleteAllFunctions = async (req: ReqWithUser): Promise<HermesFunction[]> => {
  const fnArr = await req.user.getFunction()
  const deleteArr = fnArr.map(fn => fn.destroy())
  await Promise.all(deleteArr)
  return fnArr
}

const createNewFunction = async (req: ReqWithUser): Promise<HermesFunction> => {
  const newFunction = await db.HermesFunction.build({
    ownerUserId: req.user.id,
    functionName: req.body.functionName,
    language: req.body.language,
    gpuCapable: req.body.gpuCapable,
    scope: req.body.scope,
    imageUrl: req.body.imageUrl,
    functionVersion: req.body.functionVersion,
  })

  await newFunction.save()
  return newFunction
}

const deleteOneFunction = async (req: ReqWithFn): Promise<HermesFunction> => {
  await req.fn.destroy()
  return req.fn
}

const updateFunction = async (req: ReqWithFn): Promise<HermesFunction> => {
  const fn = await req.fn.set({
    ...(req.body.functionName != null ? { functionName: req.body.functionName } : {}),
    ...(req.body.language != null ? { language: req.body.language } : {}),
    ...(req.body.gpuCapable != null ? { gpuCapable: req.body.gpuCapable } : {}),
    ...(req.body.scope != null ? { scope: req.body.scope } : {}),
    ...(req.body.imageUrl != null ? { imageUrl: req.body.imageUrl } : {}),
    ...(req.body.functionVersion != null ? { functionVersion: req.body.functionVersion } : {}),
  })

  await fn.save()
  return fn
}

const getOneFunction = async (req: ReqWithFn): Promise<HermesFunction> => {
  return req.fn
}

const createResponseObject = (req: ReqWithUser, res: any) => {
  return {
    user: req.user.toJSON(),
    ...res,
  }
}

export const writeFnOnReq = async (req: ReqWithFn, res: Response, next: NextFunction) => {
  try {
    const fnArr = await req.user.getFunction({ where: { functionName: req.params.functionName } })
    if (fnArr.length == 0)
      throw new NoSuchFunction(
        `No function with name ${req.params.functionName} for user ${req.user.username}`,
        400
      )
    req.fn = fnArr[0]
    next()
  } catch (err) {
    next(err)
  }
}

export const handleOneFunction = async (req: ReqWithFn, res: Response, next: NextFunction) => {
  try {
    if (req.method == 'DELETE') {
      const deletedFunction = (await deleteOneFunction(req)).toJSON()
      res.status(200).send(createResponseObject(req, { deletedFunction }))
    } else if (req.method == 'GET') {
      const fn = (await getOneFunction(req)).toJSON()
      res.status(200).send(createResponseObject(req, { function: fn }))
    } else if (req.method == 'PUT') {
      const updatedFunction = (await updateFunction(req)).toJSON()
      res.status(200).send(createResponseObject(req, { updatedFunction }))
    } else {
      res.status(400).send('This route only accepts DELETE, GET or PUT requests')
      return
    }
  } catch (err) {
    next(err)
  }
}

export const handleAllFunctions = async (req: ReqWithUser, res: Response, next: NextFunction) => {
  try {
    if (req.method == 'DELETE') {
      const deletedFunctions = (await deleteAllFunctions(req)).map(fn => fn.toJSON())
      res.status(200).send(createResponseObject(req, { deletedFunctions }))
    } else if (req.method == 'GET') {
      const functions = (await getAllFunctions(req)).map(fn => fn.toJSON())
      res.status(200).send(createResponseObject(req, { functions }))
    } else if (req.method == 'POST') {
      const newFunction = (await createNewFunction(req)).toJSON()
      res.status(200).send(createResponseObject(req, { newFunction }))
    } else {
      res.status(400).send('This route only accepts DELETE, GET or POST requests')
      return
    }
  } catch (err) {
    next(err)
  }
}
