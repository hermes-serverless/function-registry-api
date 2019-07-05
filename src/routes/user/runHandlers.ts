import { NextFunction, Response } from 'express'
import { Op } from 'sequelize'
import { db, Run } from '../../db'
import { NoSuchRun } from '../errors/RouteError'
import { HermesFunction } from './../../db/models/definitions/HermesFunction'
import { User } from './../../db/models/definitions/User'
import { Logger } from './../../utils/Logger'
import { ReqWithRun } from './types.d'
import {
  checkValidation,
  createResponseObject,
  excludeAttributes,
  getFunctionArr,
  getUser,
} from './utils'

export const writeRunOnReq = async (req: ReqWithRun, res: Response, next: NextFunction) => {
  try {
    const { functionOwner, functionName, functionVersion, runId } = req.params
    const owner = functionOwner ? await getUser(functionOwner) : null
    const fnArr = owner ? await getFunctionArr(owner, functionName, functionVersion) : null
    if (functionOwner && functionName && functionVersion) req.fn = fnArr[0]
    if (req.method === 'POST') return next()

    const fnRestriction = fnArr ? { functionId: { [Op.in]: fnArr.map(fn => fn.id) } } : {}
    const runArr = await req.user.getRuns({
      where: { ...(runId ? { id: runId } : fnRestriction) },
      attributes: { exclude: ['functionId'] },
      include: [
        {
          model: HermesFunction,
          as: 'function',
          attributes: { exclude: ['id', 'ownerId'] },
          include: [
            {
              model: User,
              attributes: { exclude: ['password', 'id', 'createdAt', 'updatedAt'] },
              as: 'owner',
            },
          ],
        },
      ],
    })

    if (runId && runArr.length === 0) {
      throw new NoSuchRun({
        msg: `No run with id ${runId}`,
        errorName: 'NoSuchRun',
        statusCode: 404,
      })
    }

    req.runArr = runArr
    next()
  } catch (err) {
    next(err)
  }
}

export class BaseRunHandler {
  public static async handler(req: ReqWithRun, res: Response, next: NextFunction) {
    try {
      const ops = new BaseRunHandler(req)
      if (req.method === 'DELETE') {
        const deletedRuns = (await ops.del()).map(fn => fn.toJSON())
        res.status(200).send(createResponseObject(req, { deletedRuns }))
      } else if (req.method === 'GET') {
        const runs = (await ops.get()).map(fn => fn.toJSON())
        res.status(200).send(createResponseObject(req, { runs }))
      } else {
        res.status(400).send('This route only accepts DELETE and GET requests')
        return
      }
    } catch (err) {
      next(err)
    }
  }

  protected req: ReqWithRun
  constructor(req: ReqWithRun) {
    this.req = req
  }

  get = (): Run[] => {
    return this.req.runArr
  }

  del = async (): Promise<Run[]> => {
    const deleteArr = this.req.runArr.map(run => run.destroy())
    await Promise.all(deleteArr)
    return this.req.runArr
  }
}

export class OneRunHandler extends BaseRunHandler {
  public static async handler(req: ReqWithRun, res: Response, next: NextFunction) {
    try {
      const ops = new OneRunHandler(req)
      if (req.method === 'DELETE') {
        const deletedRuns = (await ops.del()).map(fn => fn.toJSON())
        res.status(200).send(createResponseObject(req, { deletedRuns }))
      } else if (req.method === 'GET') {
        const runs = (await ops.get()).map(fn => fn.toJSON())
        res.status(200).send(createResponseObject(req, { runs }))
      } else if (req.method === 'PUT') {
        const updatedRuns = [(await ops.upd()).toJSON()]
        res.status(200).send(createResponseObject(req, { updatedRuns }))
      } else {
        res.status(400).send('This route only accepts DELETE, GET or PUT requests')
        return
      }
    } catch (err) {
      next(err)
    }
  }

  public upd = async (): Promise<Run> => {
    const { startTime, status, endTime, outputPath } = this.req.body
    try {
      const run = await this.req.runArr[0].set({
        ...(startTime != null ? { startTime } : {}),
        ...(status != null ? { status } : {}),
        ...(endTime != null ? { endTime } : {}),
        ...(outputPath != null ? { outputPath } : {}),
      })
      await run.save()
      return run
    } catch (err) {
      Logger.error('Error on update OneRun\n', err)
      checkValidation(err)
      throw err
    }
  }
}

export class RunCreatorHandler extends BaseRunHandler {
  public static async handler(req: ReqWithRun, res: Response, next: NextFunction) {
    try {
      const ops = new RunCreatorHandler(req)
      if (req.method === 'DELETE') {
        const deletedRuns = (await ops.del()).map(fn => fn.toJSON())
        res.status(200).send(createResponseObject(req, { deletedRuns }))
      } else if (req.method === 'GET') {
        const runs = (await ops.get()).map(fn => fn.toJSON())
        res.status(200).send(createResponseObject(req, { runs }))
      } else if (req.method === 'POST') {
        const createdRun = [
          {
            ...(await ops.create()).toJSON(),
            function: excludeAttributes(req.fn!.toJSON(), ['id', 'ownerId']),
          },
        ]
        res.status(200).send(createResponseObject(req, { createdRun }))
      } else {
        res.status(400).send('This route only accepts DELETE, GET or POST requests')
        return
      }
    } catch (err) {
      next(err)
    }
  }

  public create = async (): Promise<Run> => {
    const { startTime, status, endTime, outputPath } = this.req.body
    const userId = this.req.user.id
    const functionId = this.req.fn!.id
    try {
      const createdRun = await db.Run.build({
        functionId,
        userId,
        startTime,
        status,
        endTime,
        outputPath,
      })

      await createdRun.save()
      return createdRun
    } catch (err) {
      Logger.error('Error on create RunCreator\n', err)
      checkValidation(err)
      throw err
    }
  }
}
